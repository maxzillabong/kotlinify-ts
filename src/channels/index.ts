import { CancellationError } from '../coroutines'

export const UNLIMITED = -1
export const CONFLATED = -2
export const RENDEZVOUS = 0

export interface SendChannel<T> {
  send(value: T): Promise<void>
  close(): void
  get isClosedForSend(): boolean
}

export interface ReceiveChannel<T> extends AsyncIterable<T> {
  receive(): Promise<T>
  receiveCatching(): Promise<{ value?: T; isClosed: boolean }>
  close(): void
  get isClosedForReceive(): boolean
  cancel(reason?: string): void
}

export class Channel<T> implements SendChannel<T>, ReceiveChannel<T> {
  private queue: T[] = []
  private receivers: Array<(value: T | typeof CLOSED) => void> = []
  private senders: Array<{ value: T; resolve: () => void; reject: (error: Error) => void }> = []
  private _closed = false
  private _cancelled = false
  private capacity: number

  constructor(capacity: number = RENDEZVOUS) {
    this.capacity = capacity
  }

  async send(value: T): Promise<void> {
    if (this._closed || this._cancelled) {
      throw new Error('Channel is closed for send')
    }

    const receiver = this.receivers.shift()
    if (receiver) {
      receiver(value)
      return
    }

    if (this.capacity === CONFLATED) {
      this.queue = [value]
      return
    }

    if (this.capacity === UNLIMITED || this.queue.length < this.capacity) {
      this.queue.push(value)
      return
    }

    return new Promise((resolve, reject) => {
      if (this._closed || this._cancelled) {
        reject(new Error('Channel closed while waiting'))
        return
      }
      this.senders.push({ value, resolve, reject })
    })
  }

  async receive(): Promise<T> {
    if (this.queue.length > 0) {
      const queueValue = this.queue.shift()!
      const sender = this.senders.shift()
      if (sender) {
        if (this.capacity === CONFLATED) {
          this.queue = [sender.value]
        } else {
          this.queue.push(sender.value)
        }
        sender.resolve()
      }
      return queueValue
    }

    const sender = this.senders.shift()
    if (sender) {
      sender.resolve()
      return sender.value
    }

    if (this._closed) {
      throw new Error('Channel is closed for receive')
    }

    if (this._cancelled) {
      throw new CancellationError('Channel was cancelled')
    }

    return new Promise((resolve, reject) => {
      this.receivers.push((value) => {
        if (value === CLOSED) {
          reject(new Error('Channel is closed for receive'))
        } else {
          resolve(value)
        }
      })
    })
  }

  async receiveCatching(): Promise<{ value?: T; isClosed: boolean }> {
    try {
      const value = await this.receive()
      return { value, isClosed: false }
    } catch (error) {
      return { isClosed: true }
    }
  }

  close(): void {
    if (this._closed) return
    this._closed = true
    this.receivers.forEach((r) => r(CLOSED))
    this.receivers = []
    this.senders.forEach(({ reject }) => {
      reject(new Error('Channel was closed'))
    })
    this.senders = []
  }

  cancel(_?: string): void {
    if (this._cancelled) return
    this._cancelled = true
    this._closed = true
    this.receivers.forEach((r) => r(CLOSED))
    this.receivers = []
    this.senders.forEach(({ reject }) => {
      reject(new CancellationError('Channel was cancelled'))
    })
    this.senders = []
  }

  get isClosedForSend(): boolean {
    return this._closed || this._cancelled
  }

  get isClosedForReceive(): boolean {
    return (this._closed || this._cancelled) && this.queue.length === 0
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: async (): Promise<IteratorResult<T>> => {
        if (this.isClosedForReceive) {
          return { done: true, value: undefined }
        }
        try {
          const value = await this.receive()
          return { done: false, value }
        } catch {
          return { done: true, value: undefined }
        }
      },
    }
  }
}

const CLOSED = Symbol('CLOSED')

export class BroadcastChannel<T> {
  private subscribers: Array<Channel<T>> = []
  private _closed = false

  async send(value: T): Promise<void> {
    if (this._closed) {
      throw new Error('BroadcastChannel is closed')
    }
    await Promise.all(this.subscribers.map((sub) => sub.send(value)))
  }

  openSubscription(): ReceiveChannel<T> {
    const channel = new Channel<T>(UNLIMITED)
    this.subscribers.push(channel)
    return channel
  }

  close(): void {
    if (this._closed) return
    this._closed = true
    this.subscribers.forEach((sub) => sub.close())
    this.subscribers = []
  }

  cancel(): void {
    this.subscribers.forEach((sub) => sub.cancel())
    this.subscribers = []
  }
}

export function produce<T>(
  block: (channel: SendChannel<T>) => Promise<void>
): ReceiveChannel<T> {
  const channel = new Channel<T>(UNLIMITED)

  Promise.resolve()
    .then(() => block(channel))
    .then(() => channel.close())
    .catch((error) => {
      channel.cancel(error.message)
    })

  return channel
}

export async function consumeEach<T>(
  channel: ReceiveChannel<T>,
  action: (value: T) => void | Promise<void>
): Promise<void> {
  for await (const value of channel) {
    await action(value)
  }
}

export function ticker(delayMs: number, initialDelayMs: number = delayMs): ReceiveChannel<number> {
  const channel = new Channel<number>(0)
  let timeoutId: any
  let stopped = false

  const tick = async (n: number) => {
    if (stopped || channel.isClosedForSend) {
      return
    }

    try {
      await channel.send(n)
      if (!stopped) {
        timeoutId = setTimeout(() => tick(n + 1), delayMs)
      }
    } catch (error) {
      stopped = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  timeoutId = setTimeout(() => tick(0), initialDelayMs)

  const originalClose = channel.close.bind(channel)
  channel.close = () => {
    stopped = true
    if (timeoutId) clearTimeout(timeoutId)
    originalClose()
  }

  const originalCancel = channel.cancel.bind(channel)
  channel.cancel = (reason?: string) => {
    stopped = true
    if (timeoutId) clearTimeout(timeoutId)
    originalCancel(reason)
  }

  return channel
}

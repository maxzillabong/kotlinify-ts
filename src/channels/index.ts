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
  private senders: Array<{ value: T; resolve: () => void }> = []
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

    if (this.receivers.length > 0) {
      const receiver = this.receivers.shift()!
      receiver(value)
      return
    }

    if (this.capacity === UNLIMITED || this.queue.length < this.capacity) {
      this.queue.push(value)
      return
    }

    if (this.capacity === CONFLATED) {
      this.queue = [value]
      return
    }

    return new Promise((resolve) => {
      this.senders.push({ value, resolve })
    })
  }

  async receive(): Promise<T> {
    if (this.queue.length > 0) {
      const value = this.queue.shift()!
      if (this.senders.length > 0) {
        const { value: senderValue, resolve } = this.senders.shift()!
        if (this.capacity === CONFLATED) {
          this.queue = [senderValue]
        } else {
          this.queue.push(senderValue)
        }
        resolve()
      }
      return value
    }

    if (this.senders.length > 0) {
      const { value, resolve } = this.senders.shift()!
      resolve()
      return value
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
  }

  cancel(_?: string): void {
    if (this._cancelled) return
    this._cancelled = true
    this._closed = true
    this.receivers.forEach((r) => r(CLOSED))
    this.receivers = []
    this.senders.forEach(({ resolve }) => resolve())
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
  const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)))

  return produce(async (channel) => {
    let tick = 0

    try {
      await wait(initialDelayMs)

      while (true) {
        await channel.send(tick++)
        await wait(delayMs)
      }
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'Channel is closed for send') {
        throw error
      }
    }
  })
}

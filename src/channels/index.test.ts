import { describe, it, expect } from 'vitest'
import { Channel, RENDEZVOUS, UNLIMITED, CONFLATED } from './index'

describe('Channel', () => {
  describe('basic operations', () => {
    it('send and receive values', async () => {
      const ch = new Channel<number>()

      const receivePromise = ch.receive()
      const sendPromise = ch.send(42)

      const received = await receivePromise
      await sendPromise

      expect(received).toBe(42)
    })

    it('buffered channel stores values', async () => {
      const ch = new Channel<number>(2)

      await ch.send(1)
      await ch.send(2)

      expect(await ch.receive()).toBe(1)
      expect(await ch.receive()).toBe(2)
    })

    it('unlimited channel never blocks send', async () => {
      const ch = new Channel<number>(UNLIMITED)

      await ch.send(1)
      await ch.send(2)
      await ch.send(3)

      expect(await ch.receive()).toBe(1)
      expect(await ch.receive()).toBe(2)
      expect(await ch.receive()).toBe(3)
    })

    it('conflated channel only keeps latest value', async () => {
      const ch = new Channel<number>(CONFLATED)

      await ch.send(1)
      await ch.send(2)
      await ch.send(3)

      expect(await ch.receive()).toBe(3)
    })
  })

  describe('close behavior', () => {
    it('close rejects pending receive', async () => {
      const ch = new Channel<number>(RENDEZVOUS)
      const receivePromise = ch.receive()

      ch.close()

      await expect(receivePromise).rejects.toThrow('Channel is closed for receive')
    })

    it('close allows receiving buffered values', async () => {
      const ch = new Channel<number>(2)

      await ch.send(1)
      await ch.send(2)
      ch.close()

      expect(await ch.receive()).toBe(1)
      expect(await ch.receive()).toBe(2)
      await expect(ch.receive()).rejects.toThrow('Channel is closed for receive')
    })

    it('close prevents new sends', async () => {
      const ch = new Channel<number>()
      ch.close()

      await expect(ch.send(42)).rejects.toThrow('Channel is closed for send')
    })

    it('double close is idempotent', () => {
      const ch = new Channel<number>()
      ch.close()
      ch.close()

      expect(ch.isClosedForSend).toBe(true)
    })

    it('receiveCatching returns isClosed on closed channel', async () => {
      const ch = new Channel<number>(RENDEZVOUS)
      ch.close()

      const result = await ch.receiveCatching()
      expect(result.isClosed).toBe(true)
      expect(result.value).toBeUndefined()
    })
  })

  describe('cancel behavior', () => {
    it('cancel rejects pending receive with CancellationError', async () => {
      const ch = new Channel<number>(RENDEZVOUS)
      const receivePromise = ch.receive()

      ch.cancel()

      await expect(receivePromise).rejects.toThrow('Channel is closed for receive')
    })

    it('cancel resolves pending senders', async () => {
      const ch = new Channel<number>(RENDEZVOUS)

      const sendPromise = ch.send(42)
      ch.cancel()

      await expect(sendPromise).resolves.toBeUndefined()
    })

    it('cancel prevents new sends', async () => {
      const ch = new Channel<number>()
      ch.cancel()

      await expect(ch.send(42)).rejects.toThrow('Channel is closed for send')
    })

    it('double cancel is idempotent', () => {
      const ch = new Channel<number>()
      ch.cancel()
      ch.cancel()

      expect(ch.isClosedForSend).toBe(true)
    })
  })

  describe('race conditions', () => {
    it('close while receive is waiting', async () => {
      const ch = new Channel<number>(RENDEZVOUS)

      const receivePromise = ch.receive()

      setTimeout(() => ch.close(), 10)

      await expect(receivePromise).rejects.toThrow('Channel is closed for receive')
    })

    it('cancel while send is waiting', async () => {
      const ch = new Channel<number>(RENDEZVOUS)

      const sendPromise = ch.send(42)

      setTimeout(() => ch.cancel(), 10)

      await expect(sendPromise).resolves.toBeUndefined()
    })

    it('close while multiple receives are waiting', async () => {
      const ch = new Channel<number>(RENDEZVOUS)

      const receive1 = ch.receive()
      const receive2 = ch.receive()
      const receive3 = ch.receive()

      ch.close()

      await expect(receive1).rejects.toThrow('Channel is closed for receive')
      await expect(receive2).rejects.toThrow('Channel is closed for receive')
      await expect(receive3).rejects.toThrow('Channel is closed for receive')
    })

    it('cancel while multiple sends are waiting', async () => {
      const ch = new Channel<number>(RENDEZVOUS)

      const send1 = ch.send(1)
      const send2 = ch.send(2)
      const send3 = ch.send(3)

      ch.cancel()

      await expect(send1).resolves.toBeUndefined()
      await expect(send2).resolves.toBeUndefined()
      await expect(send3).resolves.toBeUndefined()
    })

    it('send and receive race correctly', async () => {
      const ch = new Channel<number>(RENDEZVOUS)

      const receivePromise = ch.receive()
      const sendPromise = ch.send(42)

      const received = await receivePromise
      await sendPromise

      expect(received).toBe(42)
    })
  })

  describe('async iteration', () => {
    it('iterates over channel values', async () => {
      const ch = new Channel<number>(2)

      await ch.send(1)
      await ch.send(2)
      ch.close()

      const values: number[] = []
      for await (const value of ch) {
        values.push(value)
      }

      expect(values).toEqual([1, 2])
    })

    it('stops iteration when channel is closed', async () => {
      const ch = new Channel<number>(UNLIMITED)

      setTimeout(async () => {
        await ch.send(1)
        await ch.send(2)
        ch.close()
      }, 10)

      const values: number[] = []
      for await (const value of ch) {
        values.push(value)
      }

      expect(values).toEqual([1, 2])
    })
  })
})

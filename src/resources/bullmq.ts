import { type Queue, type Worker } from 'bullmq'
import { type Redis } from 'ioredis'
import { handleFailed } from '../helpers/handle-failed.js'
import { handleMessage } from '../helpers/handle-message.js'
import { handleProgress } from '../helpers/handle-progress.js'
import micromatch from 'micromatch'
import { redis } from './redis.js'

type Workers = Record<string, {
  queue: Queue
  start?: () => Promise<void>
  stop?: () => Promise<void>
  worker: Worker
} | undefined>

const workerNames = process.env.WORKERS?.split(':') ?? '*'
const workers = await import('../workers/index.js') as Workers

let listener: Redis

export async function start (): Promise<void> {
  await Promise.all(Object
    .entries(workers)
    .map(async ([workerName, worker]) => {
      if (micromatch.isMatch(workerName, workerNames)) {
        worker?.worker.on('progress', handleProgress)
        worker?.worker.on('failed', handleFailed)
        await worker?.start?.()
      }
    }))

  listener = redis.duplicate()

  listener.addListener('message', handleMessage)
  await listener.subscribe('queue')
}

export async function stop (): Promise<void> {
  await Promise.all(Object
    .entries(workers)
    .map(async ([workerName, worker]) => {
      if (micromatch.isMatch(workerName, workerNames)) {
        if (worker?.stop === undefined) {
          await worker?.worker.close()
        } else {
          await worker?.stop()
        }
      }
    }))

  listener.removeListener('message', handleMessage)
  await listener.unsubscribe('queue')
  await listener.quit()
}

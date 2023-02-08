import { type Job, Queue, Worker } from 'bullmq'
import { redis } from '../resources/redis.js'

export const queue = new Queue('child', {
  connection: redis
})

export const worker = new Worker('child', child, {
  connection: redis
})

async function child (job: Job): Promise<void> {
  try {
    if (job.data.data === 'data2') {
      throw new Error('Error in child')
    }

    await job.updateProgress({
      ok: 1
    })
  } catch (error) {
    console.error(error)

    await job.updateProgress({
      err: 1
    })
  }
}

import { type Job, Queue, Worker } from 'bullmq'
import { queue as childQueue } from './child.js'
import { insertJob } from '../helpers/insert-job.js'
import { redis } from '../resources/redis.js'

export async function start (): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    await queue.add('work', null, {
      repeat: {
        pattern: '0 * * * *'
      }
    })
  }
}

export const queue = new Queue('parent', {
  connection: redis
})

export const worker = new Worker('parent', parent, {
  connection: redis
})

async function parent (job: Job): Promise<void> {
  await insertJob(job)

  await job.updateProgress({
    total: 2
  })

  await childQueue.add('child', {
    data: 'data',
    jobId: job.id
  })

  await childQueue.add('child', {
    data: 'data2',
    jobId: job.id
  })
}

import { Job } from '../entities/job.js'
import { type Job as QueueJob } from 'bullmq'
import { postgres } from '../resources/postgres.js'

export async function insertJob (queueJob: QueueJob): Promise<void> {
  await postgres.manager.insert(Job, {
    data: queueJob.data,
    err: 0,
    jobId: queueJob.id,
    name: queueJob.queueName,
    ok: 0,
    total: 0
  })
}

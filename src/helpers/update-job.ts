import { Job } from '../entities/job.js'
import { type Job as QueueJob } from 'bullmq'
import { postgres } from '../resources/postgres.js'

export async function updateJob (queueJob: QueueJob, job: Partial<Job>): Promise<void> {
  await postgres.manager.update(Job, {
    jobId: queueJob.data?.jobId ?? queueJob?.id
  }, {
    err: typeof job.err === 'number'
      ? () => `err + ${job.err ?? 0}`
      : undefined,
    error: job.error,
    ok: typeof job.ok === 'number'
      ? () => `ok + ${job.ok ?? 0}`
      : undefined,
    total: typeof job.total === 'number'
      ? () => `total + ${job.total ?? 0}`
      : undefined
  })
}

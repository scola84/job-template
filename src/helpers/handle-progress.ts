import { type Job as QueueJob } from 'bullmq'
import { updateJob } from './update-job.js'

interface Progress {
  err?: number
  ok?: number
  total?: number
}

export function handleProgress (queueJob: QueueJob, progress: Progress | number): void {
  Promise
    .resolve()
    .then(async () => {
      if (typeof progress === 'object') {
        await updateJob(queueJob, progress)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

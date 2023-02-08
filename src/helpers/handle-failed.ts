import { type Job as QueueJob } from 'bullmq'
import { isHttpError } from 'http-errors'
import { serializeError } from 'serialize-error'
import { updateJob } from './update-job.js'

function normalizeError (error?: unknown): unknown {
  if (isHttpError(error)) {
    return {
      data: error.data,
      message: error.message,
      name: error.name
    }
  } else if (error instanceof Error) {
    return serializeError(error)
  }
}

export function handleFailed (queueJob?: QueueJob, error?: unknown): void {
  Promise
    .resolve()
    .then(async () => {
      if (queueJob !== undefined) {
        await updateJob(queueJob, {
          error: normalizeError(error)
        })
      }
    })
    .catch((promiseError) => {
      console.error(promiseError)
    })
}

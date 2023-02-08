import { type BaseEntity } from 'typeorm'
import { isHttpError } from 'http-errors'
import { serializeError } from 'serialize-error'

interface Event extends BaseEntity {
  code: string
  data: Record<string, unknown> | null
  message: string | null
}

export async function handleError (error: unknown, event: Event): Promise<void> {
  if (isHttpError(error)) {
    event.code = error.name
    event.data = error.data
    event.message = error.message
    await event.save()
  } else if (error instanceof Error) {
    event.data = serializeError(error)
    event.message = error.message
    await event.save()
  }
}

import { MESSAGE } from '~/shared/constants/messages'
import { ERROR_CATALOG, ErrorCode } from '~/shared/errors/error-catalog'

type AppErrorOptions = {
  message?: string
  meta?: unknown
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly status: number
  public readonly meta?: unknown

  constructor(code: ErrorCode, opts?: AppErrorOptions) {
    super(opts?.message ?? MESSAGE[ERROR_CATALOG[code].messageKey])
    this.code = code
    this.status = ERROR_CATALOG[code].status
    this.meta = opts?.meta
  }
}

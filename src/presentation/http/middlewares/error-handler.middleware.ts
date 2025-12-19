import type { Request, Response, NextFunction } from 'express'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'
import { sendError } from '~/shared/http/response'
import { MESSAGE } from '~/shared/constants/messages'
import { HTTP_STATUS } from '~/shared/http/http-status'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // Lỗi xác định
  if (err instanceof AppError) {
    sendError(res, {
      status: err.status,
      code: err.code,
      message: err.message,
      meta: err.meta
    })
    return
  }

  // Lỗi không xác định
  console.error('[UNEXPECTED_ERROR]', err)

  sendError(res, {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ERROR_CODE.INTERNAL_ERROR,
    message: MESSAGE.INTERNAL_ERROR,
    meta: process.env.NODE_ENV === 'development' ? { error: err.message } : undefined
  })
}

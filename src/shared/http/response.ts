import type { Response } from 'express'
import _ from 'lodash'
import { MESSAGE } from '~/shared/constants/messages'
import { ErrorCode } from '~/shared/errors/error-catalog'
import { HTTP_STATUS } from '~/shared/http/http-status'

export type ApiResponse<TData = unknown, TMeta = unknown> = {
  success: boolean
  code: string
  message: string
  data: TData
  meta?: TMeta
}

export function sendOk<TData, TMeta = unknown>(
  res: Response,
  opts: {
    data: TData
    meta?: TMeta
    code?: string
    message?: string
    status?: number
  }
) {
  const code = opts.code ?? 'OK'
  const message = opts.message ?? MESSAGE.OK
  const status = opts.status ?? HTTP_STATUS.OK

  const body: ApiResponse<TData, TMeta> = {
    success: true,
    code,
    message,
    data: opts.data,
    ...(!_.isNil(opts.meta) ? { meta: opts.meta } : {})
  }

  return res.status(status).json(body)
}

export function sendError<TMeta = unknown>(
  res: Response,
  opts: {
    status: number
    code: ErrorCode | string
    message: string
    meta?: TMeta
  }
) {
  const body: ApiResponse<null, TMeta> = {
    success: false,
    code: opts.code,
    message: opts.message,
    data: null,
    ...(!_.isNil(opts.meta) ? { meta: opts.meta } : {})
  }

  return res.status(opts.status).json(body)
}

import { MessageKey } from '~/shared/constants/messages'
import { HTTP_STATUS } from '~/shared/http/http-status'

export const ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_DISABLED: 'USER_DISABLED',
  SESSION_REVOKED: 'SESSION_REVOKED',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export const ERROR_CATALOG: Record<ErrorCode, { status: number; messageKey: MessageKey }> = {
  [ERROR_CODE.VALIDATION_ERROR]: {
    status: HTTP_STATUS.BAD_REQUEST,
    messageKey: 'VALIDATION_ERROR'
  },

  [ERROR_CODE.UNAUTHORIZED]: {
    status: HTTP_STATUS.UNAUTHORIZED,
    messageKey: 'UNAUTHORIZED'
  },

  [ERROR_CODE.INVALID_CREDENTIALS]: {
    status: HTTP_STATUS.UNAUTHORIZED,
    messageKey: 'INVALID_CREDENTIALS'
  },

  [ERROR_CODE.USER_DISABLED]: {
    status: HTTP_STATUS.FORBIDDEN,
    messageKey: 'USER_DISABLED'
  },

  [ERROR_CODE.SESSION_REVOKED]: {
    status: HTTP_STATUS.UNAUTHORIZED,
    messageKey: 'SESSION_REVOKED'
  },

  [ERROR_CODE.EMAIL_ALREADY_EXISTS]: {
    status: HTTP_STATUS.CONFLICT,
    messageKey: 'EMAIL_ALREADY_EXISTS'
  },

  [ERROR_CODE.INTERNAL_ERROR]: {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    messageKey: 'INTERNAL_ERROR'
  }
}

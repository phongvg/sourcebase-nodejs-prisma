import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'

type ValidationTarget = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      return next(
        new AppError(ERROR_CODE.VALIDATION_ERROR, {
          meta: {
            issues: result.error.issues,
            fieldErrors: result.error.flatten().fieldErrors
          }
        })
      )
    }

    req[target] = result.data as any
    return next()
  }
}

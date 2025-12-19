import type { Request, Response, NextFunction } from 'express'
import { RegisterLocalUseCase } from '~/application/use-cases/auth/register-local.usecase'
import { LoginLocalUseCase } from '~/application/use-cases/auth/login-local.usecase'
import { LoginGoogleUseCase } from '~/application/use-cases/auth/login-google.usecase'
import { RefreshTokenUseCase } from '~/application/use-cases/auth/refresh-token.usecase'
import { LogoutUseCase } from '~/application/use-cases/auth/logout.usecase'
import { GetInfoUseCase } from '~/application/use-cases/auth/get-me.usecase'
import { sendOk } from '~/shared/http/response'
import { HTTP_STATUS } from '~/shared/http/http-status'
import { MESSAGE } from '~/shared/constants/messages'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'

export class AuthController {
  constructor(
    private readonly registerLocalUseCase: RegisterLocalUseCase,
    private readonly loginLocalUseCase: LoginLocalUseCase,
    private readonly loginGoogleUseCase: LoginGoogleUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getInfoUseCase: GetInfoUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerLocalUseCase.execute(req.body)

      sendOk(res, {
        status: HTTP_STATUS.CREATED,
        data: result,
        message: MESSAGE.REGISTER_SUCCESS
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginLocalUseCase.execute(req.body)

      sendOk(res, {
        data: result,
        message: MESSAGE.LOGIN_SUCCESS
      })
    } catch (error) {
      next(error)
    }
  }

  loginGoogle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginGoogleUseCase.execute(req.body)

      sendOk(res, {
        data: result,
        message: MESSAGE.LOGIN_SUCCESS
      })
    } catch (error) {
      next(error)
    }
  }

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body)

      sendOk(res, {
        data: result,
        message: MESSAGE.OK
      })
    } catch (error) {
      next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError(ERROR_CODE.UNAUTHORIZED))
      }

      await this.logoutUseCase.execute(req.user.userId)

      sendOk(res, {
        data: null,
        message: MESSAGE.LOGOUT_SUCCESS
      })
    } catch (error) {
      next(error)
    }
  }

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError(ERROR_CODE.UNAUTHORIZED))
      }

      const data = await this.getInfoUseCase.execute(req.user.userId)

      sendOk(res, {
        data,
        message: MESSAGE.OK
      })
    } catch (error) {
      next(error)
    }
  }
}

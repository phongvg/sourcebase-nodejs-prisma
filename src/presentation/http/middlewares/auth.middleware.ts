import _ from "lodash";
import type { Request, Response, NextFunction } from "express";
import type { TokenService } from "~/application/ports/services/token.port";
import type { SessionStore } from "~/application/ports/services/session-store.port";
import { AppError } from "~/shared/errors/app-errors";
import { ERROR_CODE } from "~/shared/errors/error-catalog";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "USER" | "ADMIN";
        sid: string;
      };
    }
  }
}

export function createAuthMiddleware(
  tokenService: TokenService,
  sessionStore: SessionStore
) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = _.trim(req.headers.authorization ?? "");
      if (!authHeader) {
        return next(new AppError(ERROR_CODE.UNAUTHORIZED));
      }

      const [type, token] = _.split(authHeader, " ");
      if (type !== "Bearer" || _.isEmpty(token)) {
        return next(new AppError(ERROR_CODE.UNAUTHORIZED));
      }

      const payload = await tokenService.verifyAccessToken(token);

      const isValidSession = await sessionStore.isValid(
        payload.userId,
        payload.sid
      );
      if (!isValidSession) {
        return next(new AppError(ERROR_CODE.SESSION_REVOKED));
      }

      req.user = {
        userId: payload.userId,
        role: payload.role,
        sid: payload.sid,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
import jwt, { JwtPayload } from "jsonwebtoken";
import _ from "lodash";

import type {
  TokenService,
  AccessTokenPayload,
  RefreshTokenPayload,
} from "~/application/ports/services/token.port";
import { AppError } from "~/shared/errors/app-errors";
import { ERROR_CODE } from "~/shared/errors/error-catalog";

type SignOpts = jwt.SignOptions;

export class TokenServiceImpl implements TokenService {
  private readonly accessOpts: SignOpts;
  private readonly refreshOpts: SignOpts;

  constructor(
    private readonly secret: string,
    private readonly accessTokenTTLSeconds: number,
    private readonly refreshTokenTTLSeconds: number,
    opts?: { issuer?: string }
  ) {
    const issuer = _.trim(opts?.issuer ?? "");

    this.accessOpts = {
      expiresIn: this.accessTokenTTLSeconds, 
      ...(issuer ? { issuer } : {}),
    };

    this.refreshOpts = {
      expiresIn: this.refreshTokenTTLSeconds, 
      ...(issuer ? { issuer } : {}),
    };
  }

  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return jwt.sign({ role: payload.role, sid: payload.sid }, this.secret, {
      ...this.accessOpts,
      subject: payload.userId,
    });
  }

  async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return jwt.sign({ sid: payload.sid }, this.secret, {
      ...this.refreshOpts,
      subject: payload.userId,
    });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const decoded = this.verify(token);

    const userId = _.trim(decoded.sub ?? "");
    const sid = _.trim(String(decoded.sid ?? ""));
    const role = decoded.role as AccessTokenPayload["role"];

    if (!userId || !sid || (role !== "USER" && role !== "ADMIN")) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }

    return { userId, sid, role };
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const decoded = this.verify(token);

    const userId = _.trim(decoded.sub ?? "");
    const sid = _.trim(String(decoded.sid ?? ""));

    if (!userId || !sid) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }

    return { userId, sid };
  }

  private verify(token: string): JwtPayload & { sid?: string; role?: string } {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === "string")
        throw new AppError(ERROR_CODE.UNAUTHORIZED);
      return decoded as JwtPayload & { sid?: string; role?: string };
    } catch {
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }
  }
}
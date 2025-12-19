import _ from "lodash";
import { OAuth2Client } from "google-auth-library";
import type {
  GoogleOAuth,
  GoogleUserInfo,
} from "~/application/ports/services/google-oauth.port";
import { AppError } from "~/shared/errors/app-errors";
import { ERROR_CODE } from "~/shared/errors/error-catalog";

export class GoogleOAuthImpl implements GoogleOAuth {
  private readonly client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client(this.clientId);
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: _.trim(idToken),
        audience: this.clientId,
      });

      const payload = ticket.getPayload();
      const googleSub = _.trim(payload?.sub ?? "");
      const email = _.trim(payload?.email ?? "").toLowerCase();

      if (!googleSub || !email) {
        throw new AppError(ERROR_CODE.UNAUTHORIZED);
      }

      return {
        googleSub,
        email,
        fullName: payload?.name ?? undefined,
        avatarUrl: payload?.picture ?? undefined,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(ERROR_CODE.UNAUTHORIZED);
    }
  }
}
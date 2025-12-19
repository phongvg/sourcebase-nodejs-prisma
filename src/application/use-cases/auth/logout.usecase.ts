import { SessionStore } from '~/application/ports/services/session-store.port'

export class LogoutUseCase {
  constructor(private readonly sessionStore: SessionStore) {}

  async execute(userId: string): Promise<void> {
    await this.sessionStore.delete(userId)
  }
}
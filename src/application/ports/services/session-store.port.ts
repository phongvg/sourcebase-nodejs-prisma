export interface SessionStore {
  /**
   * Lưu session ID cho user (ghi đè session cũ nếu có)
   * @param userId - User ID
   * @param sessionId - Session ID (UUID)
   * @param ttl - Time to live in seconds (optional, mặc định theo config)
   */
  set(userId: string, sessionId: string, ttl?: number): Promise<void>

  /**
   * Lấy session ID hiện tại của user
   * @param userId - User ID
   * @returns Session ID hoặc null nếu không có
   */
  get(userId: string): Promise<string | null>

  /**
   * Xóa session của user (logout)
   * @param userId - User ID
   */
  delete(userId: string): Promise<void>

  /**
   * Kiểm tra session có hợp lệ không
   * @param userId - User ID
   * @param sessionId - Session ID cần check
   * @returns true nếu session hợp lệ
   */
  isValid(userId: string, sessionId: string): Promise<boolean>
}

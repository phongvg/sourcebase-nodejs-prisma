import { Router } from 'express'
import { AuthController } from '~/presentation/http/controllers/auth.controller'
import { validate } from '~/presentation/http/middlewares/validate.middleware'
import { RegisterRequestSchema } from '~/application/dtos/auth/register.dto'
import { LoginLocalRequestSchema, LoginGoogleRequestSchema } from '~/application/dtos/auth/login.dto'
import { TokenService } from '~/application/ports/services/token.port'
import { SessionStore } from '~/application/ports/services/session-store.port'
import { createAuthMiddleware } from '~/presentation/http/middlewares/auth.middleware'

export function createAuthRoutes(
  authController: AuthController,
  tokenService: TokenService,
  sessionStore: SessionStore
): Router {
  const router = Router()
  const authMiddleware = createAuthMiddleware(tokenService, sessionStore)

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Đăng ký tài khoản mới
   *     description: Tạo tài khoản mới với email và password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Đăng ký thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RegisterResponse'
   *       400:
   *         description: Validation error hoặc email đã tồn tại
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/register', validate(RegisterRequestSchema), authController.register)

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Đăng nhập với email/password
   *     description: Đăng nhập bằng tài khoản local (email + password)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginLocalRequest'
   *     responses:
   *       200:
   *         description: Đăng nhập thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       401:
   *         description: Thông tin đăng nhập không đúng
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/login', validate(LoginLocalRequestSchema), authController.login)

  /**
   * @swagger
   * /api/auth/login/google:
   *   post:
   *     tags: [Auth]
   *     summary: Đăng nhập với Google
   *     description: Đăng nhập bằng Google OAuth (gửi ID token từ Google)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginGoogleRequest'
   *     responses:
   *       200:
   *         description: Đăng nhập thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       401:
   *         description: Google token không hợp lệ
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/login/google', validate(LoginGoogleRequestSchema), authController.loginGoogle)

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     tags: [Auth]
   *     summary: Đăng xuất
   *     description: Đăng xuất khỏi tài khoản (xóa session khỏi Redis)
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Đăng xuất thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LogoutResponse'
   *       401:
   *         description: Chưa đăng nhập hoặc token không hợp lệ
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/logout', authMiddleware, authController.logout)

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Lấy thông tin user hiện tại
   *     description: Lấy thông tin chi tiết của user đang đăng nhập
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MeResponse'
   *       401:
   *         description: Chưa đăng nhập hoặc token không hợp lệ
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/me', authMiddleware, authController.getMe)

  return router
}

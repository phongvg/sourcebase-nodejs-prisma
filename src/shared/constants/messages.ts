export const MESSAGE = {
  OK: 'Thành công',
  INTERNAL_ERROR: 'Có lỗi hệ thống xảy ra, vui lòng thử lại sau',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',

  //Validation
  VALIDATION_ERROR: 'Dữ liệu đầu vào chưa hợp lệ',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn',
  INVALID_CREDENTIALS: 'Thông tin đăng nhập không đúng',
  USER_DISABLED: 'Tài khoản của bạn đã bị vô hiệu hóa',
  SESSION_REVOKED: 'Tài khoản của bạn đã bị đăng nhập trên thiết bị khác',

  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng'
} as const

export type MessageKey = keyof typeof MESSAGE

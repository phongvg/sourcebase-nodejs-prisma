import swaggerJSDoc from 'swagger-jsdoc'
import { env } from './env'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BJM Course API',
    version: '1.0.0',
    description: 'API Documentation for BJM Course Backend',
    contact: {
      name: 'nguyenphongvg39@gmail.com'
    }
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer token in the format: Bearer {token}'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          code: {
            type: 'string',
            example: 'VALIDATION_ERROR'
          },
          message: {
            type: 'string',
            example: 'Dữ liệu đầu vào chưa hợp lệ'
          },
          data: {
            type: 'null',
            example: null
          },
          meta: {
            type: 'object'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'password123'
          },
          fullName: {
            type: 'string',
            minLength: 3,
            maxLength: 100,
            example: 'Nguyễn Văn A'
          }
        }
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          code: {
            type: 'string',
            example: 'OK'
          },
          message: {
            type: 'string',
            example: 'Đăng ký tài khoản thành công'
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011'
              },
              email: {
                type: 'string',
                example: 'user@example.com'
              },
              fullName: {
                type: 'string',
                nullable: true,
                example: 'Nguyễn Văn A'
              }
            }
          }
        }
      },
      LoginLocalRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            example: 'password123'
          }
        }
      },
      LoginGoogleRequest: {
        type: 'object',
        required: ['idToken'],
        properties: {
          idToken: {
            type: 'string',
            example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          code: {
            type: 'string',
            example: 'OK'
          },
          message: {
            type: 'string',
            example: 'Đăng nhập thành công'
          },
          data: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              }
            }
          }
        }
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        }
      },
      RefreshTokenResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          code: {
            type: 'string',
            example: 'OK'
          },
          message: {
            type: 'string',
            example: 'Thành công'
          },
          data: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              }
            }
          }
        }
      },
      MeResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          code: {
            type: 'string',
            example: 'OK'
          },
          message: {
            type: 'string',
            example: 'Thành công'
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011'
              },
              email: {
                type: 'string',
                example: 'user@example.com'
              },
              fullName: {
                type: 'string',
                nullable: true,
                example: 'Nguyễn Văn A'
              },
              role: {
                type: 'string',
                enum: ['USER', 'ADMIN'],
                example: 'USER'
              },
              provider: {
                type: 'string',
                enum: ['LOCAL', 'GOOGLE'],
                example: 'LOCAL'
              },
              avatarUrl: {
                type: 'string',
                nullable: true,
                example: 'https://example.com/avatar.jpg'
              },
              lastLoginAt: {
                type: 'string',
                nullable: true,
                format: 'date-time',
                example: '2025-12-19T10:30:00.000Z'
              }
            }
          }
        }
      },
      LogoutResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          code: {
            type: 'string',
            example: 'OK'
          },
          message: {
            type: 'string',
            example: 'Đăng xuất thành công'
          },
          data: {
            type: 'null',
            example: null
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints'
    }
  ]
}

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/presentation/http/routes/*.ts', './src/presentation/http/controllers/*.ts']
}

export const swaggerSpec = swaggerJSDoc(options)

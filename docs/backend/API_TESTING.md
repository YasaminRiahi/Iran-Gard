# API Testing

**API Docs:**

- Swagger: `/api/docs`
- ReDoc: `/api/redoc`

## Test Authenticated Endpoints

1. **Login & get token**

   ```
   POST /api/auth/login
   Body: { "username": "user", "password": "pass" }
   ```

2. **Add token to Authorization header**

   ```
   Authorization: Bearer <access_token>
   ```

3. **Test endpoint**
   ```
   GET /api/users/me
   ```

## Token Expiration

- Access: 30 min
- Signup token: 15 min
- Verification code: 10 min

Get `401`? Token expired, login again.

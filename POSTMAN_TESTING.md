# Postman Testing Guide for Authentication Endpoints

## Base URL

```
http://localhost:8000/api/auth
```

---

## 1. SEND SIGNUP CODE

**POST** `/send-signup-code`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "testuser@example.com"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "email": "testuser@example.com"
}
```

**Test Steps:**

1. Copy the request above into Postman
2. Send request
3. Check database for code: `SELECT code FROM verification_codes WHERE email='testuser@example.com' LIMIT 1;`
4. Copy the code for next step

---

## 2. VERIFY SIGNUP CODE

**POST** `/verify-signup-code`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "testuser@example.com",
  "code": "123456"
}
```

_Replace "123456" with the actual code from database_

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Code verified successfully",
  "email": "testuser@example.com"
}
```

---

## 3. COMPLETE SIGNUP

**POST** `/complete-signup`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "testuser@example.com",
  "username": "testuser123",
  "password": "SecurePassword123"
}
```

**Expected Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Save this token** for protected endpoint tests

---

## 4. LOGIN

**POST** `/login`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "SecurePassword123"
}
```

**Expected Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 5. FORGOT PASSWORD

**POST** `/forgot-password`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "testuser@example.com"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Password reset code sent to your email",
  "email": "testuser@example.com"
}
```

**Test Steps:**

1. Send request
2. Check database for reset code: `SELECT code FROM verification_codes WHERE email='testuser@example.com' AND code_type='reset' LIMIT 1;`
3. Copy the code for next step

---

## 6. RESET PASSWORD

**POST** `/reset-password`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "testuser@example.com",
  "code": "123456",
  "new_password": "NewPassword456"
}
```

_Replace "123456" with the actual reset code from database_

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Verify:** Login with new password to confirm

---

## COMPLETE TEST FLOW

### Full Signup & Login Flow:

**Step 1:** Send Signup Code

```json
POST http://localhost:8000/api/auth/send-signup-code
Content-Type: application/json

{
  "email": "newuser@example.com"
}
```

**Step 2:** Get Code from Database

```sql
SELECT code FROM verification_codes WHERE email='newuser@example.com' LIMIT 1;
```

**Step 3:** Verify Code (replace XXX with actual code)

```json
POST http://localhost:8000/api/auth/verify-signup-code
Content-Type: application/json

{
  "email": "newuser@example.com",
  "code": "XXX"
}
```

**Step 4:** Complete Signup

```json
POST http://localhost:8000/api/auth/complete-signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "Password123"
}
```

**Response:** Copy the `access_token`

**Step 5:** Test Login

```json
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123"
}
```

---

## PASSWORD RESET FLOW

**Step 1:** Forgot Password

```json
POST http://localhost:8000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "newuser@example.com"
}
```

**Step 2:** Get Reset Code from Database

```sql
SELECT code FROM verification_codes WHERE email='newuser@example.com' AND code_type='reset' LIMIT 1;
```

**Step 3:** Reset Password (replace XXX with actual code)

```json
POST http://localhost:8000/api/auth/reset-password
Content-Type: application/json

{
  "email": "newuser@example.com",
  "code": "XXX",
  "new_password": "NewPassword999"
}
```

**Step 4:** Login with New Password

```json
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "NewPassword999"
}
```

---

## ERROR CASES TO TEST

### 1. Email Already Registered

```json
POST http://localhost:8000/api/auth/send-signup-code
Content-Type: application/json

{
  "email": "newuser@example.com"
}
```

**Expected:** 400 Bad Request - "This email is already registered"

### 2. Invalid Code

```json
POST http://localhost:8000/api/auth/verify-signup-code
Content-Type: application/json

{
  "email": "newuser@example.com",
  "code": "000000"
}
```

**Expected:** 400 Bad Request - "Invalid or expired verification code"

### 3. Wrong Login Credentials

```json
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "WrongPassword"
}
```

**Expected:** 401 Unauthorized - "Incorrect email or password"

### 4. Forgot Password - Email Not Registered

```json
POST http://localhost:8000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "nonexistent@example.com"
}
```

**Expected:** 404 Not Found - "No account found with this email"

### 5. Invalid Email Format

```json
POST http://localhost:8000/api/auth/send-signup-code
Content-Type: application/json

{
  "email": "not-an-email"
}
```

**Expected:** 422 Unprocessable Entity - Validation error

---

## POSTMAN COLLECTION IMPORT

You can also import this as a Postman Collection. Create a file with this structure and import it into Postman:

```json
{
  "info": {
    "name": "Iran-Gard Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Send Signup Code",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"testuser@example.com\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/auth/send-signup-code",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "auth", "send-signup-code"]
        }
      }
    },
    {
      "name": "Verify Signup Code",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"testuser@example.com\", \"code\": \"123456\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/auth/verify-signup-code",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "auth", "verify-signup-code"]
        }
      }
    },
    {
      "name": "Complete Signup",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"testuser@example.com\", \"username\": \"testuser123\", \"password\": \"SecurePassword123\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/auth/complete-signup",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "auth", "complete-signup"]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"testuser@example.com\", \"password\": \"SecurePassword123\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Forgot Password",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"testuser@example.com\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/auth/forgot-password",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "auth", "forgot-password"]
        }
      }
    },
    {
      "name": "Reset Password",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"testuser@example.com\", \"code\": \"123456\", \"new_password\": \"NewPassword456\"}"
        },
        "url": {
          "raw": "http://localhost:8000/api/auth/reset-password",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["api", "auth", "reset-password"]
        }
      }
    }
  ]
}
```

---

## QUICK START

1. **Open Postman**
2. **Create new request**
3. **Select POST method**
4. **Paste the URL** from above
5. **Go to Body tab** → select **raw** → select **JSON**
6. **Paste the JSON body**
7. **Click Send**
8. **Check the response**

That's it!

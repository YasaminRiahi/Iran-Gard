# API Client

Login → token auto-stored → `apiClient` auto-injects token in requests.

```javascript
import { apiClient } from "../services/api-client.js";
import { login } from "../services/auth-service.js";

await login("username", "password");
const profile = await apiClient.get("/users/me");
const result = await apiClient.post("/favorites", { place_id: 1 });
const places = await apiClient.get("/places", { includeAuth: false }); // public
```

**Handle errors:**

```javascript
const res = await apiClient.get("/endpoint");
if (res.success === false) {
  alert(res.error); // Persian message
  return;
}
```

**Signup:**

```javascript
import {
  sendSignUpCode,
  verifySignupCode,
  completeSignup,
} from "../services/auth-service.js";

await sendSignUpCode("email@example.com");
const res = await verifySignupCode("email@example.com", "123456");
await completeSignup(
  "email@example.com",
  "username",
  "password",
  res.signup_token
);
```

**Logout:**

```javascript
localStorage.removeItem("access_token");
```

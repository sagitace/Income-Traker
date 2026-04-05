# Income Tracker API Endpoints Documentation

## Base URL

```
http://localhost:8000/api
```

---

## Authentication Endpoints

### POST /auth/register

**Description:** User registration

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "secure_password_123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2026-04-05T10:00:00Z"
}
```

---

### POST /auth/login

**Description:** User login

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

---

### POST /auth/refresh

**Description:** Refresh access token

**Headers:** `Authorization: Bearer {refresh_token}`

**Response (200 OK):**

```json
{
  "access_token": "new_token",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### POST /auth/logout

**Description:** User logout (optional - mainly for frontend cleanup)

**Headers:** `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

---

## Income Endpoints

### POST /income

**Description:** Create a new income entry

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**

```json
{
  "amount": 5000.0,
  "source": "Salary",
  "year": 2026,
  "month": 4,
  "day": 5,
  "date": "2026-04-05",
  "notes": "Monthly salary payment"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "amount": 5000.0,
  "savings_amount": 1000.0,
  "emergency_amount": 500.0,
  "source": "Salary",
  "year": 2026,
  "month": 4,
  "day": 5,
  "date": "2026-04-05",
  "notes": "Monthly salary payment",
  "created_at": "2026-04-05T10:00:00Z"
}
```

**Note:** `savings_amount` and `emergency_amount` are automatically calculated based on current `ipon_settings` percentages. Year/Month/Day are stored separately for easy filtering and mobile-friendly display.

---

### GET /income

**Description:** Get all income entries for the authenticated user

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**

- `skip`: int (default: 0)
- `limit`: int (default: 50, max: 100)
- `date_from`: date (optional, format: YYYY-MM-DD)
- `date_to`: date (optional, format: YYYY-MM-DD)
- `source`: string (optional, filter by source)

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "uuid",
      "amount": 5000.0,
      "savings_amount": 1000.0,
      "emergency_amount": 500.0,
      "source": "Salary",
      "year": 2026,
      "month": 4,
      "day": 5,
      "date": "2026-04-05",
      "notes": "Monthly salary payment",
      "created_at": "2026-04-05T10:00:00Z"
    }
  ],
  "total": 45,
  "skip": 0,
  "limit": 50
}
```

---

### GET /income/{income_id}

**Description:** Get a specific income entry

**Headers:** `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "id": "uuid",
  "amount": 5000.0,
  "savings_amount": 1000.0,
  "emergency_amount": 500.0,
  "source": "Salary",
  "year": 2026,
  "month": 4,
  "day": 5,
  "date": "2026-04-05",
  "notes": "Monthly salary payment",
  "created_at": "2026-04-05T10:00:00Z"
}
```

---

### PUT /income/{income_id}

**Description:** Update an income entry

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**

```json
{
  "amount": 5200.0,
  "source": "Salary",
  "year": 2026,
  "month": 4,
  "day": 6,
  "date": "2026-04-06",
  "notes": "Updated notes"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "amount": 5200.0,
  "savings_amount": 1040.0,
  "emergency_amount": 520.0,
  "source": "Salary",
  "year": 2026,
  "month": 4,
  "day": 6,
  "date": "2026-04-06",
  "notes": "Updated notes",
  "created_at": "2026-04-05T10:00:00Z",
  "updated_at": "2026-04-05T11:00:00Z"
}
```

**Note:** Savings and emergency amounts are recalculated based on current percentages when updating.

---

### DELETE /income/{income_id}

**Description:** Delete an income entry

**Headers:** `Authorization: Bearer {access_token}`

**Response (204 No Content)**

---

## Ipon Settings Endpoints

### GET /settings/ipon

**Description:** Get current Ipon settings

**Headers:** `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "savings_percentage": 20.0,
  "emergency_percentage": 10.0,
  "created_at": "2026-04-05T10:00:00Z"
}
```

---

### PUT /settings/ipon

**Description:** Update Ipon settings

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**

```json
{
  "savings_percentage": 25.0,
  "emergency_percentage": 15.0
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "savings_percentage": 25.0,
  "emergency_percentage": 15.0,
  "created_at": "2026-04-05T10:00:00Z",
  "updated_at": "2026-04-05T11:00:00Z"
}
```

**Important:** Only affects FUTURE income entries. Existing records remain unchanged.

---

## Dashboard Endpoints

### GET /dashboard/summary

**Description:** Get overall financial summary

**Headers:** `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "total_income": 25000.0,
  "total_savings": 5000.0,
  "total_emergency": 2500.0,
  "entries_count": 5,
  "last_updated": "2026-04-05T10:00:00Z"
}
```

---

### GET /dashboard/monthly/{year}/{month}

**Description:** Get monthly summary for a specific month

**Headers:** `Authorization: Bearer {access_token}`

**Parameters:**

- `year`: int (e.g., 2026)
- `month`: int (1-12)

**Response (200 OK):**

```json
{
  "year": 2026,
  "month": 4,
  "total_income": 5000.0,
  "total_savings": 1000.0,
  "total_emergency": 500.0,
  "entries_count": 1,
  "entries": [
    {
      "id": "uuid",
      "amount": 5000.0,
      "savings_amount": 1000.0,
      "emergency_amount": 500.0,
      "source": "Salary",
      "date": "2026-04-05"
    }
  ]
}
```

---

### GET /dashboard/yearly/{year}

**Description:** Get yearly summary by month breakdown

**Headers:** `Authorization: Bearer {access_token}`

**Parameters:**

- `year`: int (e.g., 2026)

**Response (200 OK):**

```json
{
  "year": 2026,
  "total_income": 25000.0,
  "total_savings": 5000.0,
  "total_emergency": 2500.0,
  "monthly_breakdown": [
    {
      "month": 1,
      "income": 5000.0,
      "savings": 1000.0,
      "emergency": 500.0
    },
    {
      "month": 4,
      "income": 5000.0,
      "savings": 1000.0,
      "emergency": 500.0
    }
  ]
}
```

---

## Reports Endpoints

### GET /reports/export/csv

**Description:** Export income data as CSV

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**

- `date_from`: date (optional)
- `date_to`: date (optional)

**Response (200 OK):** CSV file download

---

### GET /reports/export/excel

**Description:** Export income data as Excel

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**

- `date_from`: date (optional)
- `date_to`: date (optional)

**Response (200 OK):** Excel file download

---

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "detail": "Access denied"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 409 Conflict

```json
{
  "detail": "Resource already exists"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```

---

## Authentication Flow

1. User calls `POST /auth/register` to create account
2. User calls `POST /auth/login` with email and password
3. Server returns `access_token` (short-lived JWT)
4. Client includes token in `Authorization: Bearer {token}` header
5. When token expires, client calls `POST /auth/refresh` with refresh token
6. All subsequent requests use the new token

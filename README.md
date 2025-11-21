# Iran-Gard API

A comprehensive FastAPI backend for collaborative trip planning in Iran. This system enables users to plan group trips, manage expenses, vote on places, and create daily itineraries.

## Features

### Phase 1: User Management (Weeks 1-2)
- ✅ User registration and authentication (JWT-based)
- ✅ User profile management
- ✅ Favorite categories selection

### Phase 2: Social & Trip Creation (Weeks 3-4)
- ✅ Friend system (send/accept/reject requests)
- ✅ Trip creation with multiple cities
- ✅ Invite friends to trips
- ✅ Place suggestions based on user preferences

### Phase 3: Voting & Planning (Weeks 5-6)
- ✅ Add places to trips
- ✅ Vote on trip places
- ✅ Create daily packages (manual)
- ⏳ Auto-generate trip packages (to be implemented)
- ✅ Vote on packages

### Phase 4: Expenses & Reviews (Weeks 7-8)
- ✅ Track trip expenses
- ✅ Automatic expense splitting
- ✅ Settlement calculation
- ⏳ Trip completion and reviews (to be implemented)

## Tech Stack

- **Framework:** FastAPI 0.104+
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT tokens with python-jose
- **Password Hashing:** bcrypt via passlib
- **Database Migrations:** Alembic
- **Validation:** Pydantic v2

## Project Structure

```
iran-gard/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependencies (auth, db session)
│   │   └── v1/
│   │       ├── api.py           # API router aggregator
│   │       └── endpoints/       # API endpoints
│   │           ├── auth.py      # Registration & login
│   │           ├── users.py     # User management
│   │           ├── friends.py   # Friend system
│   │           ├── trips.py     # Trip management
│   │           ├── places.py    # Places & comments
│   │           ├── expenses.py  # Expense tracking
│   │           └── categories.py
│   ├── core/
│   │   ├── config.py           # Settings management
│   │   └── security.py         # Password & token utilities
│   ├── crud/                   # Database operations
│   │   ├── user.py
│   │   ├── friend.py
│   │   ├── trip.py
│   │   ├── place.py
│   │   └── expense.py
│   ├── db/
│   │   ├── base.py             # Import all models
│   │   └── session.py          # Database session
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── city.py
│   │   ├── place.py
│   │   ├── friend.py
│   │   ├── trip.py
│   │   ├── trip_package.py
│   │   └── expense.py
│   └── schemas/                # Pydantic schemas
│       ├── user.py
│       ├── category.py
│       ├── city.py
│       ├── place.py
│       ├── friend.py
│       ├── trip.py
│       ├── trip_package.py
│       └── expense.py
├── Database/
│   └── tables.sql              # Database schema
├── main.py                     # Application entry point
├── requirements.txt
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Prerequisites
- Python 3.10+
- PostgreSQL 12+
- Virtual environment tool

### 2. Installation

```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

```powershell
# Create PostgreSQL database
# Using psql or pgAdmin, create a database named 'iran_gard'

# Run the schema file
psql -U postgres -d iran_gard -f Database\tables.sql
```

### 4. Environment Configuration

```powershell
# Copy example env file
copy .env.example .env

# Edit .env and update:
# - DATABASE_URL (your PostgreSQL connection string)
# - SECRET_KEY (generate a secure random key)
```

### 5. Run the Application

```powershell
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/api/v1/docs
- **ReDoc:** http://localhost:8000/api/v1/redoc

## API Documentation

Once the server is running, visit http://localhost:8000/api/v1/docs for interactive API documentation with Swagger UI.

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

#### Users
- `GET /api/v1/users/me` - Get current user info
- `GET /api/v1/users/search?q={query}` - Search users
- `POST /api/v1/users/me/favorite-categories` - Add favorite category

#### Friends
- `POST /api/v1/friends/requests` - Send friend request
- `GET /api/v1/friends/requests/pending` - Get pending requests
- `GET /api/v1/friends` - Get friends list

#### Trips
- `POST /api/v1/trips` - Create new trip
- `GET /api/v1/trips/my-trips` - Get user's trips
- `POST /api/v1/trips/{trip_id}/invitations` - Invite friend to trip
- `POST /api/v1/trips/{trip_id}/places` - Add place to trip

#### Places
- `GET /api/v1/places?city_name={city}` - Get places by city
- `GET /api/v1/places?user_preferences=true` - Get personalized places
- `POST /api/v1/places/{place_id}/like` - Like a place
- `POST /api/v1/places/{place_id}/comments` - Comment on place

#### Expenses
- `POST /api/v1/expenses/trips/{trip_id}/expenses` - Create expense
- `GET /api/v1/expenses/trips/{trip_id}/summary` - Get expense summary & settlements

## Development Workflow

### Adding New Features

1. **Create Model** in `app/models/`
2. **Create Schema** in `app/schemas/`
3. **Create CRUD operations** in `app/crud/`
4. **Create API endpoint** in `app/api/v1/endpoints/`
5. **Register router** in `app/api/v1/api.py`

### Code Style

- Follow PEP 8 guidelines
- Use type hints consistently
- Write clear docstrings
- Keep functions focused and single-purpose

## Database Schema Highlights

- **Users & Authentication:** JWT-based auth with hashed passwords
- **Friend System:** Mutual friend requests with auto-friendship trigger
- **Trips:** Multi-city trips with member management
- **Places:** JSONB location data, categories, photos, likes, comments
- **Expenses:** Detailed tracking with automatic share calculation
- **Voting:** React system for both places and packages

## Next Steps (To Implement)

1. **Auto-Plan Algorithm** (`app/services/auto_planner.py`)
   - Implement trip package generation based on:
     - Trip duration
     - Member preferences
     - Place proximity (JSONB location data)
     - Daily time constraints

2. **Settlement Optimization**
   - Improve debt settlement algorithm to minimize transactions

3. **File Upload**
   - Implement photo upload for places
   - Add cloud storage integration (S3/MinIO)

4. **Trip Reviews**
   - Add rating and review system after trip completion
   - Store ratings in place_comments table

5. **Database Migrations**
   - Set up Alembic for schema versioning
   - Create initial migration from tables.sql

6. **Testing**
   - Add pytest test suite
   - Implement endpoint testing
   - Add CRUD operation tests

## Contributing

This is a university project. For questions or contributions, contact the team members.

## License

Educational project - No license specified

## Team

- Ali Abbasi (Team Lead)
- Kimia Sadeghi
- Yasmin Riahi
- MohammadReza Abedin


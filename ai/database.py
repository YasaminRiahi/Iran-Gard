"""
database.py
===========
Database connection and query execution module for IranGard.

Responsibilities:
    - Manage PostgreSQL connections
    - Execute read-only SQL queries safely
    - Return results as list of dicts for easy JSON serialization
"""

import os
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 5432)),
    "dbname":   os.getenv("DB_NAME"),
    "user":     os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

# Schema description passed to the LLM for SQL generation
DB_SCHEMA = """
Database: IranGard (Iranian travel app)

Tables:

1. places (place_id, place_name, city_name, province_name, place_location, description, category_id)
   → Tourist attractions with location and description

2. cities (city_name)
   → List of cities

3. provinces (province_name)
   → List of provinces

4. categories:
   category_id = 1 → طبیعت‌گردی
   category_id = 2 → تاریخی
   category_id = 3 → تجاری و تفریحی
   category_id = 4 → مذهبی

5. place_photos (photo_num, place_id, url)
   → Photos for each place

6. users (user_id, username, email, gender, full_name, about_me, profile_url, favorite_categories)
   → App users (gender: Male / Female / Other)

7. trips (trip_id, owner_id, start_date, end_date, status, cover_image, city_names)
   → User trips (status: planning / ongoing / finished)
   → city_names is an ARRAY of city name strings

8. trip_locations (trip_id, place_id, visited, added_at)
   → Places included in a trip, with visited flag

9. trip_location_votes (trip_id, place_id, user_id, vote_type)
   → Member votes on places in a trip

10. trip_plans (plan_id, trip_id, title, city_name, created_at)
    → Day/city plans within a trip

11. trip_plan_locations (plan_id, place_id, order, estimated_time_minutes)
    → Ordered places in a plan with estimated visit time

12. trip_plan_votes (plan_id, user_id, vote_type)
    → Member votes on trip plans

13. trip_participants (trip_id, user_id)
    → Members of a trip

14. trip_invitations (invitation_id, trip_id, sender_id, receiver_id, status, created_at)
    → Trip invitations (status: PENDING / ACCEPTED / REJECTED)

15. wishlist (user_id, place_id, added_date)
    → User's saved/bookmarked places

16. place_reviews (review_id, user_id, place_id, rating, review, created_at)
    → User reviews and ratings on places (rating is integer)

17. liked_reviews (review_id, user_id)
    → Likes on reviews

18. friendships (friendship_id, requester_id, addressee_id, status, created_at, updated_at)
    → Friendships and friend requests combined
    → status: pending / accepted / rejected / blocked

19. expenses (expense_id, trip_id, payer_id, amount, category, description, created_at)
    → Trip expenses

20. expense_participants (expense_id, user_id, share)
    → Each member's share of an expense

Few-shot SQL examples:

Q: جاذبه‌های تاریخی اصفهان
SQL: SELECT p.place_name, p.description FROM places p WHERE p.city_name = 'اصفهان' AND p.category_id = 2 LIMIT 20

Q: جاذبه‌های طبیعی شیراز
SQL: SELECT p.place_name, p.description FROM places p WHERE p.city_name = 'شیراز' AND p.category_id = 1 LIMIT 20

Q: جاذبه‌های مذهبی مشهد
SQL: SELECT p.place_name, p.description FROM places p WHERE p.city_name = 'مشهد' AND p.category_id = 4 LIMIT 20

Q: جاذبه‌های استان تهران
SQL: SELECT p.place_name, p.city_name FROM places p WHERE p.province_name = 'تهران' LIMIT 20

Q: بهترین جاذبه‌ها بر اساس امتیاز
SQL: SELECT p.place_name, p.city_name, ROUND(AVG(r.rating), 1) AS avg_rating, COUNT(r.review_id) AS review_count FROM places p LEFT JOIN place_reviews r ON p.place_id = r.place_id GROUP BY p.place_id, p.place_name, p.city_name HAVING COUNT(r.review_id) > 0 ORDER BY avg_rating DESC LIMIT 10

Q: جاذبه‌هایی که بیشتر به wishlist اضافه شدن
SQL: SELECT p.place_name, p.city_name, COUNT(w.user_id) AS saved_count FROM places p JOIN wishlist w ON p.place_id = w.place_id GROUP BY p.place_id, p.place_name, p.city_name ORDER BY saved_count DESC LIMIT 10

Q: چند کاربر داریم؟
SQL: SELECT COUNT(*) AS user_count FROM users

Q: سفرهای در حال برنامه‌ریزی
SQL: SELECT t.trip_id, u.username, t.start_date, t.end_date, t.city_names FROM trips t JOIN users u ON t.owner_id = u.user_id WHERE t.status = 'planning' LIMIT 20

Q: پرتکرارترین مقصدهای سفر
SQL: SELECT unnest(city_names) AS city, COUNT(*) AS trip_count FROM trips GROUP BY city ORDER BY trip_count DESC LIMIT 10

Q: نظرات کاربران درباره یک جاذبه
SQL: SELECT u.username, r.rating, r.review, r.created_at FROM place_reviews r JOIN users u ON r.user_id = u.user_id WHERE r.place_id = (SELECT place_id FROM places WHERE place_name = 'نقش جهان' LIMIT 1) ORDER BY r.created_at DESC LIMIT 10

Q: اطلاعات در مورد جزیره هنگام
SQL: SELECT p.place_name, p.description FROM places p WHERE p.place_name = 'جزیره هنگام'


IMPORTANT: There is NO 'categories' table. 
Use category_id directly as an integer in WHERE clauses.
Example: WHERE p.category_id = 2  ✓
Never do: JOIN categories ...     ✗

"""


# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------

def get_connection():
    """
    Create and return a new PostgreSQL connection.

    Returns:
        psycopg2 connection object.

    Raises:
        psycopg2.OperationalError: If the database is unreachable.
    """
    return psycopg2.connect(**DB_CONFIG)


def test_connection() -> bool:
    """
    Verify that the database is reachable.

    Returns:
        True if connection succeeds, False otherwise.
    """
    try:
        conn = get_connection()
        conn.close()
        print("[DB] Connection successful")
        return True
    except Exception as e:
        print(f"[DB] Connection failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Query execution
# ---------------------------------------------------------------------------

def run_query(sql: str) -> list[dict]:
    """
    Execute a SQL query and return results as a list of dicts.

    Only SELECT statements are permitted to prevent any accidental
    data modification through the AI pipeline.

    Args:
        sql: SQL query string to execute.

    Returns:
        List of rows, each represented as a dict keyed by column name.

    Raises:
        ValueError: If the query is not a SELECT statement.
        Exception:  On database errors.
    """
    sql_normalized = sql.strip().upper()
    if not sql_normalized.startswith("SELECT"):
        raise ValueError(f"Only SELECT queries are permitted. Got: {sql[:50]}")

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql)
            rows = cur.fetchall()
            return [dict(row) for row in rows]
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Entry point — connection test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("IranGard — Database Module")
    print("=" * 60)

    if test_connection():
        try:
            results = run_query("SELECT COUNT(*) AS total FROM places")
            print(f"[DB] Total places in database: {results[0]['total']}")
        except Exception as e:
            print(f"[DB] Query failed: {e}")
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import re
import random
import string
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import hashlib
import secrets
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)



load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

EMAIL_CONFIG = {
    'smtp_server': os.getenv('EMAIL_SMTP_SERVER'),
    'smtp_port': os.getenv('EMAIL_SMTP_PORT'),
    'email': os.getenv('EMAIL_ADDRESS'),
    'password': os.getenv('EMAIL_PASSWORD')
}


def get_db():
    """اتصال به دیتابیس با RealDictCursor"""
    conn = psycopg2.connect(
        host=DB_CONFIG['host'],
        database=DB_CONFIG['database'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password']
    )
    return conn


def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None


def generate_code():
    return ''.join(random.choices(string.digits, k=6))


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def send_email(to_email, subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain', 'utf-8'))

        with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
            server.starttls()
            server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Email Error: {e}")
        return False


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return jsonify({'success': False, 'error': 'همه فیلدها الزامی است'}), 400

        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        hashed = hash_password(password)
        cur.execute("""
            SELECT user_id, username, email, profile_url 
            FROM users 
            WHERE username = %s AND user_password = %s
        """, (username, hashed))

        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            return jsonify({'success': False, 'error': 'نام کاربری یا رمز اشتباه است'}), 401

        token = secrets.token_urlsafe(32)

        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'user_id': user['user_id'],
                'username': user['username'],
                'email': user['email'],
                'profile_url': user['profile_url']
            }
        }), 200

    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({'success': False, 'error': 'خطا در ارتباط'}), 500


@app.route('/api/send-signup-code', methods=['POST'])
def send_signup_code():
    try:
        data = request.json
        email = data.get('email', '').strip().lower()

        if not email:
            return jsonify({'success': False, 'error': 'ایمیل الزامی است'}), 400

        if not validate_email(email):
            return jsonify({'success': False, 'error': 'ایمیل نامعتبر است'}), 400

        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT email FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'این ایمیل قبلاً ثبت شده است'}), 400

        code = generate_code()
        expires_at = datetime.now() + timedelta(minutes=10)

        cur.execute("DELETE FROM verification_codes WHERE email = %s", (email,))

        cur.execute("""
            INSERT INTO verification_codes (email, code, expires_at)
            VALUES (%s, %s, %s)
        """, (email, code, expires_at))

        conn.commit()
        cur.close()
        conn.close()

        subject = 'کد تایید ثبت‌نام - ایران‌گردی'
        body = f"""
سلام،

کد تایید شما: {code}

این کد تا 10 دقیقه معتبر است.

با تشکر،
تیم ایران‌گردی
        """

        if not send_email(email, subject, body):
            return jsonify({'success': False, 'error': 'خطا در ارسال ایمیل'}), 500

        return jsonify({'success': True, 'message': 'کد ارسال شد!'}), 200

    except Exception as e:
        print(f"Send Verification Error: {e}")
        return jsonify({'success': False, 'error': 'خطا در ارتباط'}), 500


@app.route('/api/verify-signup-code', methods=['POST'])
def verify_signup_code():
    try:
        data = request.json
        code = data.get('code', '').strip()
        email = data.get('email', '').strip().lower()

        if not code:
            return jsonify({'success': False, 'error': 'فیلد کد الزامیست'}), 400

        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT expires_at, is_used
            FROM verification_codes
            WHERE email = %s AND code = %s
            ORDER BY created_at DESC LIMIT 1
        """, (email, code))

        result = cur.fetchone()

        if not result:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'کد تایید اشتباه است'}), 400

        if result['is_used']:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'این کد قبلاً استفاده شده'}), 400

        if datetime.now() > result['expires_at']:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'کد منقضی شده. دوباره تلاش کنید'}), 400

        cur.execute("""
            UPDATE verification_codes 
            SET is_used = TRUE 
            WHERE email = %s AND code = %s
        """, (email, code))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'کد تایید شد'}), 200

    except Exception as e:
        print(f"Verify Code Error: {e}")
        return jsonify({'success': False, 'error': 'خطا'}), 500


@app.route('/api/complete-signup', methods=['POST'])
def complete_signup():
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not all([email, username, password]):
            return jsonify({'success': False, 'error': 'همه فیلدها الزامی است'}), 400

        if len(password) < 6:
            return jsonify({'success': False, 'error': 'رمز حداقل 6 کاراکتر'}), 400

        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT username FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'این نام کاربری قبلاً گرفته شده است'}), 400

        hashed = hash_password(password)
        cur.execute("""
            INSERT INTO users (username, email, user_password, profile_url)
            VALUES (%s, %s, %s, 'default.jpg')
            RETURNING user_id
        """, (username, email, hashed))

        user_id = cur.fetchone()['user_id']

        conn.commit()
        cur.close()
        conn.close()

        token = secrets.token_urlsafe(32)

        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'user_id': user_id,
                'username': username,
                'email': email,
                'profile_url': 'default.jpg'
            }
        }), 200

    except Exception as e:
        print(f"Complete Signup Error: {e}")
        return jsonify({'success': False, 'error': 'خطا'}), 500


@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.json
        email = data.get('email', '').strip().lower()

        if not email:
            return jsonify({'success': False, 'error': 'ایمیل الزامی است'}), 400

        if not validate_email(email):
            return jsonify({'success': False, 'error': 'ایمیل نامعتبر'}), 400

        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT username FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'ایمیل پیدا نشد'}), 404

        code = generate_code()
        expires_at = datetime.now() + timedelta(minutes=10)

        cur.execute("DELETE FROM verification_codes WHERE email = %s AND code_type = 'reset'", (email,))

        cur.execute("""
            INSERT INTO verification_codes (email, code, code_type, expires_at)
            VALUES (%s, %s, 'reset', %s)
        """, (email, code, expires_at))

        conn.commit()
        cur.close()
        conn.close()

        subject = 'کد بازیابی رمز عبور - ایران‌گردی'
        body = f"""
سلام {user['username']},

کد بازیابی رمز عبور شما: 
{code}

این کد تا 10 دقیقه معتبر است.

تیم ایران‌گردی
        """

        if not send_email(email, subject, body):
            return jsonify({'success': False, 'error': 'خطا در ارسال ایمیل'}), 500

        return jsonify({'success': True, 'message': 'کد ارسال شد!'}), 200

    except Exception as e:
        print(f"Forgot Password Error: {e}")
        return jsonify({'success': False, 'error': 'خطا در ارتباط'}), 500


@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip()
        new_password = data.get('newPassword', '')

        if not all([email, code, new_password]):
            return jsonify({'success': False, 'error': 'اطلاعات ناقص'}), 400

        if len(new_password) < 6:
            return jsonify({'success': False, 'error': 'رمز حداقل 6 کاراکتر'}), 400

        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT expires_at, is_used 
            FROM verification_codes 
            WHERE email = %s AND code = %s AND code_type = 'reset'
            ORDER BY created_at DESC LIMIT 1
        """, (email, code))

        result = cur.fetchone()

        if not result:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'کد اشتباه'}), 400

        if result['is_used']:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'این کد قبلاً استفاده شده'}), 400

        if datetime.now() > result['expires_at']:
            cur.close()
            conn.close()
            return jsonify({'success': False, 'error': 'کد منقضی شده'}), 400

        hashed = hash_password(new_password)
        cur.execute("""
            UPDATE users 
            SET user_password = %s 
            WHERE email = %s
        """, (hashed, email))

        cur.execute("""
            UPDATE verification_codes 
            SET is_used = TRUE 
            WHERE email = %s AND code = %s
        """, (email, code))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'رمز با موفقیت تغییر کرد!'}), 200

    except Exception as e:
        print(f"Reset Password Error: {e}")
        return jsonify({'success': False, 'error': 'خطا در ارتباط'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
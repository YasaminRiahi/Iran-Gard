"""
Email utility module for sending verification codes and notifications.
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails."""

    def __init__(self, smtp_server: str, smtp_port: int, email: str, password: str):
        """
        Initialize email service.

        Args:
            smtp_server: SMTP server address
            smtp_port: SMTP server port
            email: Email address to send from
            password: Email password/token
        """
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.email = email
        self.password = password

    def send_verification_code_email(
        self, to_email: str, code: str, code_type: str = "signup"
    ) -> bool:
        """
        Send verification code email.

        Args:
            to_email: Recipient email
            code: Verification code
            code_type: Type of code ('signup' or 'reset')

        Returns:
            True if sent successfully, False otherwise
        """
        if code_type == "reset":
            subject = "کد بازیابی رمز عبور - ایران‌گردی"
            body = f"""
سلام،

کد بازیابی رمز عبور شما: {code}

این کد تا 10 دقیقه معتبر است.

با تشکر،
تیم ایران‌گردی
            """
        else:  # signup
            subject = "کد تایید ثبت‌نام - ایران‌گردی"
            body = f"""
سلام،

کد تایید شما: {code}

این کد تا 10 دقیقه معتبر است.

با تشکر،
تیم ایران‌گردی
            """

        return self._send_email(to_email, subject, body)

    def _send_email(self, to_email: str, subject: str, body: str) -> bool:
        """
        Send email (internal method).

        Args:
            to_email: Recipient email
            subject: Email subject
            body: Email body

        Returns:
            True if sent successfully, False otherwise
        """
        try:
            msg = MIMEMultipart()
            msg["From"] = self.email
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain", "utf-8"))

            with smtplib.SMTP(self.smtp_server, int(self.smtp_port)) as server:
                server.starttls()
                server.login(self.email, self.password)
                server.send_message(msg)

            logger.info(f"Email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False


# Placeholder - will be initialized in main.py
_email_service: Optional[EmailService] = None


def get_email_service() -> Optional[EmailService]:
    """Get email service instance."""
    return _email_service


def set_email_service(service: EmailService) -> None:
    """Set email service instance."""
    global _email_service
    _email_service = service

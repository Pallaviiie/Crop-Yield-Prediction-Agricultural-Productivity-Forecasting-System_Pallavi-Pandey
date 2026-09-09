import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


def send_password_reset_otp(recipient_email: str, otp: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")

    sender_email = os.getenv(
        "SMTP_FROM_EMAIL",
        smtp_username
    )

    if not smtp_username or not smtp_password:
        raise RuntimeError(
            "SMTP email configuration is missing."
        )

    # Gmail App Password may be displayed with spaces.
    smtp_password = smtp_password.replace(" ", "")

    message = EmailMessage()

    message["Subject"] = "YieldSense AI - Password Reset OTP"
    message["From"] = sender_email
    message["To"] = recipient_email

    message.set_content(
        f"""Hello,

We received a request to reset your YieldSense AI password.

Your password reset OTP is:

{otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
YieldSense AI Team
"""
    )

    try:
        with smtplib.SMTP(
            smtp_host,
            smtp_port,
            timeout=30
        ) as server:

            server.ehlo()
            server.starttls()
            server.ehlo()

            server.login(
                smtp_username,
                smtp_password
            )

            server.send_message(message)

            print(
                f"PASSWORD RESET EMAIL SENT TO: {recipient_email}"
            )

    except smtplib.SMTPAuthenticationError as e:

        print("SMTP AUTHENTICATION ERROR:", e)

        raise RuntimeError(
            "Gmail SMTP authentication failed. "
            "Check SMTP_USERNAME and Gmail App Password."
        ) from e

    except Exception as e:

        print("SMTP EMAIL ERROR:", e)

        raise
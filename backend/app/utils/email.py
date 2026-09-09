import os
import requests
from dotenv import load_dotenv

load_dotenv()


def send_password_reset_otp(recipient_email: str, otp: str):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv(
        "BREVO_FROM_EMAIL",
        "yieldsenseai.support2026@gmail.com"
    )
    sender_name = os.getenv(
        "BREVO_FROM_NAME",
        "YieldSense AI"
    )

    if not api_key:
        raise RuntimeError("BREVO_API_KEY is missing.")

    url = "https://api.brevo.com/v3/smtp/email"

    payload = {
        "sender": {
            "name": sender_name,
            "email": sender_email
        },
        "to": [
            {
                "email": recipient_email
            }
        ],
        "subject": "YieldSense AI - Password Reset OTP",
        "textContent": f"""Hello,

We received a request to reset your YieldSense AI password.

Your password reset OTP is:

{otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
YieldSense AI Team
"""
    }

    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=30
        )

        if not response.ok:
            print("BREVO HTTP ERROR:", response.status_code)
            print("BREVO RESPONSE:", response.text)

            raise RuntimeError(
                f"Brevo email API failed with status "
                f"{response.status_code}: {response.text}"
            )

        print(f"PASSWORD RESET EMAIL SENT TO: {recipient_email}")

    except requests.RequestException as e:
        print("BREVO NETWORK ERROR:", e)
        raise RuntimeError(
            f"Unable to connect to Brevo email service: {e}"
        ) from e
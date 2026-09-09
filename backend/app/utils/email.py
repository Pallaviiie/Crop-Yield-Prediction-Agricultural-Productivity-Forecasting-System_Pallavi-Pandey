import json
import os
import urllib.error
import urllib.request

from dotenv import load_dotenv

load_dotenv()


def send_password_reset_otp(recipient_email: str, otp: str):
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv(
        "RESEND_FROM_EMAIL",
        "onboarding@resend.dev"
    )

    if not api_key:
        raise RuntimeError("RESEND_API_KEY is not configured.")

    payload = {
        "from": from_email,
        "to": [recipient_email],
        "subject": "YieldSense AI - Password Reset OTP",
        "text": f"""Hello,

We received a request to reset your YieldSense AI password.

Your password reset OTP is:

{otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
YieldSense AI Team
""",
    }

    data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        "https://api.resend.com/emails",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            response_body = response.read().decode("utf-8")

            if response.status not in (200, 201):
                raise RuntimeError(
                    f"Resend API returned status {response.status}: "
                    f"{response_body}"
                )

            print("PASSWORD RESET EMAIL SENT:", response_body)

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")

        print("RESEND HTTP ERROR:", e.code)
        print("RESEND RESPONSE:", error_body)

        raise RuntimeError(
            f"Resend email API failed with status {e.code}: {error_body}"
        ) from e

    except urllib.error.URLError as e:
        print("RESEND NETWORK ERROR:", e)

        raise RuntimeError(
            f"Unable to connect to Resend API: {e}"
        ) from e

    except Exception as e:
        print("RESEND EMAIL ERROR:", e)
        raise
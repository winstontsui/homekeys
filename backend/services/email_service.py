import os
from typing import cast
import smtplib
import logging
from email.mime.text import MIMEText


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

EMAIL_HOST = cast(str, os.getenv("EMAIL_HOST"))
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_HOST_USER = cast(str, os.getenv("EMAIL_HOST_USER"))
EMAIL_HOST_PASSWORD = cast(str, os.getenv("EMAIL_HOST_PASSWORD"))
EMAIL_FROM = cast(str, os.getenv("EMAIL_FROM"))

def send_email_summary(to_email, summary):
    """Send an email with the call summary using SMTP."""
    subject = "Thank You from HomeKeys - Call Summary"
    body = f"{summary}"
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_FROM
    msg["To"] = to_email

    try:
        logger.info("Connecting to SMTP server...")
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()  # Start TLS for security
        logger.info("Starting TLS...")
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        logger.info("Logged in to SMTP server successfully.")
        server.sendmail(EMAIL_FROM, [to_email], msg.as_string())
        logger.info(f"Summary email sent to {to_email}.")
        server.quit()
    except Exception as e:
        logger.error(f"Failed to send summary email: {e}")
        
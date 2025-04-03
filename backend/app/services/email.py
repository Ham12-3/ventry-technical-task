import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
import logging

from app.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM, EMAIL_FROM_NAME

logger = logging.getLogger(__name__)

def generate_exclusive_code() -> str:
    """
    Generate a random exclusive access code
    """
    return str(uuid.uuid4())[:8].upper()

async def send_exclusive_code(email: str, code: str) -> bool:
    """
    Send the exclusive access code to the user's email
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Email not sent.")
        return False
    
    message = MIMEMultipart("alternative")
    message["Subject"] = f"Your Exclusive Access Code for Ventry"
    message["From"] = f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>"
    message["To"] = email
    
    # Create plain text version
    text = f"""
    Hello,

    Thank you for requesting exclusive access to Ventry!
    
    Your exclusive access code is: {code}
    
    Please enter this code in the application to unlock premium features.
    
    This code will expire in 24 hours.
    
    Best regards,
    The Ventry Team
    """
    
    # Create HTML version
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; padding: 20px;">
          <h2 style="color: #1B3154;">Your Exclusive Access Code</h2>
          <p>Hello,</p>
          <p>Thank you for requesting exclusive access to Ventry!</p>
          <p>Your exclusive access code is:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold; color: #1B3154;">
            {code}
          </div>
          <p>Please enter this code in the application to unlock premium features.</p>
          <p>This code will expire in 24 hours.</p>
          <p>Best regards,<br>The Ventry Team</p>
        </div>
      </body>
    </html>
    """
    
    # Attach both versions
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, email, message.as_string())
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False
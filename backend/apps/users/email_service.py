from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


class EmailService:
    """
    Service for sending emails using Django templates
    """
    
    @staticmethod
    def send_newsletter_welcome_email(email, full_name=None):
        """
        Send welcome email to newsletter subscriber
        """
        try:
            subject = "Welcome to Explore Nepal Newsletter!"
            
            # Render HTML template
            html_message = render_to_string('emails/newsletter_welcome.html', {
                'email': email,
                'name': full_name or email.split('@')[0]
            })
            
            # Create email
            email_message = EmailMultiAlternatives(
                subject=subject,
                body=f"Welcome to Explore Nepal Newsletter!",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            
            # Attach HTML version
            email_message.attach_alternative(html_message, "text/html")
            
            # Send email
            email_message.send(fail_silently=False)
            print(f"✓ Welcome email sent to {email}")
            return True
            
        except Exception as e:
            print(f"✗ Error sending email to {email}: {str(e)}")
            return False

    @staticmethod
    def send_promotional_email(subject, message_html, recipient_list):
        """
        Send promotional email to multiple subscribers
        """
        try:
            email_message = EmailMultiAlternatives(
                subject=subject,
                body="Explore Nepal Newsletter",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=recipient_list
            )
            
            email_message.attach_alternative(message_html, "text/html")
            email_message.send(fail_silently=False)
            print(f"✓ Email sent to {len(recipient_list)} subscribers")
            return True
            
        except Exception as e:
            print(f"✗ Error sending promotional email: {str(e)}")
            return False

    @staticmethod
    def send_contact_reply_email(contact_email, contact_name, subject):
        """
        Send reply email to contact form submissions
        """
        try:
            email_subject = f"Re: {subject}"
            
            # Render HTML template
            html_message = render_to_string('emails/contact_reply.html', {
                'name': contact_name,
                'subject': subject
            })
            
            email_message = EmailMultiAlternatives(
                subject=email_subject,
                body=f"Thank you for contacting us",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[contact_email]
            )
            
            email_message.attach_alternative(html_message, "text/html")
            email_message.send(fail_silently=False)
            print(f"✓ Reply email sent to {contact_email}")
            return True
            
        except Exception as e:
            print(f"✗ Error sending reply email: {str(e)}")
            return False
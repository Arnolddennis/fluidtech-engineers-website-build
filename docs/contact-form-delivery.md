# Contact form email delivery

The homepage and contact page submit a normal HTTPS POST to FormSubmit, addressed to `fluidtechindia@gmail.com`. Visitors supply their name, email address and enquiry. An email address is required for the acknowledgement and customer replies.

- `_template=table` formats the business notification.
- `_autoresponse` supplies the acknowledgement in the visitor's selected language.
- FormSubmit's reCAPTCHA remains enabled. Autoresponses are not supported by its AJAX submission route or with reCAPTCHA disabled.
- `_honey` is an additional hidden spam field.
- `_next` returns visitors to the website's contact page after processing. The local success message does not verify inbox delivery.
- No email service credentials are included in the website.

## Activation and live acceptance test

1. Submit a clearly labelled test enquiry on the published contact page with an email address you control.
2. Complete FormSubmit's spam check.
3. Check `fluidtechindia@gmail.com`, including spam, and click the activation link if FormSubmit requests verification.
4. Submit another test after activation. Confirm that the business inbox receives the customer name, email and enquiry, and that the customer receives the acknowledgement.
5. Reply to the business notification and confirm the reply is addressed to the customer.

Activation and inbox delivery have not yet been verified. The automated activation request received FormSubmit's Cloudflare browser-signature block (403 / 1010); it was not retried after diagnosis. Complete activation through the ordinary browser flow.

Provider documentation: https://formsubmit.co/documentation

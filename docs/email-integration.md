# Contact-form email integration

The portfolio contact form posts to `/api/contact`. The server validates the submission, applies a honeypot and a best-effort rate limit, and sends the enquiry to the inbox configured by `CONTACT_TO_EMAIL` through the Resend Email API. The visitor's email address is used as **Reply-To**, so you can reply directly to the person who contacted you. If email delivery is unavailable, the form offers a pre-filled email draft as a fallback.

## Required account setup

1. Create or sign in to a [Resend account](https://resend.com/).
2. In Resend, add a domain that you own and can manage DNS for, then complete its verification. Resend requires a verified sending domain for normal sending: [Verified domains guide](https://resend.com/docs/dashboard/domains/introduction).
3. Create a Resend API key with permission to send email: [API keys guide](https://resend.com/docs/dashboard/api-keys/introduction). Keep this key private.

## Configure Vercel

Open the portfolio project in Vercel, then go to **Settings → Environment Variables**. Add these variables for **Production**. Add them to **Preview** too if you need to test preview deployments.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key. Mark it as sensitive/encrypted. |
| `RESEND_FROM_EMAIL` | A sender on your verified domain, e.g. `AKASH / WORKS <website@your-verified-domain.com>`. Replace the example with your real domain. |
| `CONTACT_TO_EMAIL` | `abhsingh76@gmail.com` (the portfolio inbox; this already is the code default if the variable is omitted). |

Do not add the API key to React code, commit it to GitHub, or paste it into a public issue or chat. Enter it directly into Vercel's environment-variable value field.

**Redeploy after saving the variables.** Vercel applies environment-variable changes to new deployments, not deployments that already exist: [Vercel environment-variable documentation](https://vercel.com/docs/environment-variables/managing-environment-variables).

## Test the integration

1. Open `/contact.html` on the production site and submit a real test enquiry with a valid service and a message of at least 10 characters.
2. Check the destination inbox and spam folder.
3. Check the Resend dashboard's email logs if the message is not received.
4. If the form reports configuration missing, check that `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set for **Production** and redeploy.
5. If it reports a delivery failure, verify the sender domain, API key permission, and Resend logs.

The API returns a success response only after Resend accepts the send request; acceptance does not guarantee inbox placement.

## Current activation status

Source code and automated tests are in place. Automatic delivery stays inactive until valid production values are added to Vercel. The repository cannot create a Resend API key or verify DNS for a domain without account/domain-owner action.

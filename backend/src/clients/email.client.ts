import { transporter } from '@/lib/email'

export const sendEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: 'noreply@update-me.com',
    to,
    subject,
    text,
  })
}

export const sendVerificationEmail = async (to: string, url: string) => {
  await transporter.sendMail({
    from: 'update-me <noreply@update-me.com>',
    to,
    subject: 'Verify your email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f8;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 48px 40px; text-align: center;">
                    <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; color: #171717; letter-spacing: -0.5px;">
                      Verify your email
                    </h1>
                    <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #666;">
                      Thanks for signing up! Click the button below to verify your email address and get started.
                    </p>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #D35E55; border-radius: 12px;">
                          <a href="${url}" 
                             style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 12px;">
                            Verify Email
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 1.5; color: #999;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${url}" style="color: #D35E55; word-break: break-all;">${url}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #999; text-align: center;">
                      If you didn't create an account with update-me, you can safely ignore this email.<br>
                      This verification link will expire in 1 hour.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })
}

export const sendResetPasswordEmail = async (to: string, url: string) => {
  await transporter.sendMail({
    from: 'update-me <noreply@update-me.com>',
    to,
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f8;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 48px 40px; text-align: center;">
                    <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; color: #171717; letter-spacing: -0.5px;">
                      Reset your password
                    </h1>
                    <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #666;">
                      We received a request to reset your password. Click the button below to create a new password.
                    </p>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #D35E55; border-radius: 12px;">
                          <a href="${url}" 
                             style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 12px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 1.5; color: #999;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${url}" style="color: #D35E55; word-break: break-all;">${url}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #999; text-align: center;">
                      If you didn't request a password reset, you can safely ignore this email.<br>
                      This reset link will expire in 1 hour.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })
}

export const sendOrganizationInvitation = async ({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: {
  email: string
  invitedByUsername: string
  invitedByEmail: string
  teamName: string
  inviteLink: string
}) => {
  await transporter.sendMail({
    from: 'update-me <noreply@update-me.com>',
    to: email,
    subject: `${invitedByUsername} invited you to join ${teamName} on update-me`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f8;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 48px 40px; text-align: center;">
                    <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; color: #171717; letter-spacing: -0.5px;">
                      You've been invited!
                    </h1>
                    <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #666;">
                      <strong>${invitedByUsername}</strong> (${invitedByEmail}) has invited you to join the <strong>${teamName}</strong> organization on update-me.
                    </p>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #D35E55; border-radius: 12px;">
                          <a href="${inviteLink}" 
                             style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 12px;">
                            Accept Invitation
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 1.5; color: #999;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${inviteLink}" style="color: #D35E55; word-break: break-all;">${inviteLink}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #999; text-align: center;">
                      If you don't want to join this organization, you can safely ignore this email.<br>
                      This invitation link will expire in 7 days.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })
}

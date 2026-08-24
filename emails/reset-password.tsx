import * as React from "react"
import { Link, Text } from "@react-email/components"
import { BrandedEmail, EmailButton, emailStyles } from "./components/email-layout"

export function ResetPasswordEmail({ url }: { url: string }) {
  return (
    <BrandedEmail preview="Reset your password">
      <Text style={emailStyles.heading}>Reset your password</Text>
      <Text style={emailStyles.paragraph}>
        We received a request to reset the password for your account. Click the
        button below to choose a new password.
      </Text>
      <Text style={emailStyles.buttonWrap}>
        <EmailButton href={url}>Reset password</EmailButton>
      </Text>
      <Text style={emailStyles.fineprint}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <Link href={url} style={emailStyles.link}>
          {url}
        </Link>
      </Text>
      <Text style={emailStyles.fineprint}>
        If you didn&apos;t request a password reset, you can safely ignore this email —
        your password won&apos;t change.
      </Text>
    </BrandedEmail>
  )
}

export default ResetPasswordEmail

import * as React from "react"
import { Link, Text } from "@react-email/components"
import { BrandedEmail, EmailButton, emailStyles } from "./components/email-layout"

export function VerifyEmail({ url }: { url: string }) {
  return (
    <BrandedEmail preview="Verify your email">
      <Text style={emailStyles.heading}>Verify your email</Text>
      <Text style={emailStyles.paragraph}>
        Please confirm your email address to finish setting up your account. Click
        the button below to verify.
      </Text>
      <Text style={emailStyles.buttonWrap}>
        <EmailButton href={url}>Verify email</EmailButton>
      </Text>
      <Text style={emailStyles.fineprint}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <Link href={url} style={emailStyles.link}>
          {url}
        </Link>
      </Text>
      <Text style={emailStyles.fineprint}>
        If you didn&apos;t create this account, you can safely ignore this email.
      </Text>
    </BrandedEmail>
  )
}

export default VerifyEmail

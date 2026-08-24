import * as React from "react"
import { Link, Text } from "@react-email/components"
import { BrandedEmail, EmailButton, emailStyles } from "./components/email-layout"

export function SignInEmail({ url }: { url: string }) {
  return (
    <BrandedEmail preview="Your secure sign-in link">
      <Text style={emailStyles.heading}>Sign in</Text>
      <Text style={emailStyles.paragraph}>
        Click the button below to sign in. This link expires in 24 hours and can only
        be used once.
      </Text>
      <Text style={emailStyles.buttonWrap}>
        <EmailButton href={url}>Sign in</EmailButton>
      </Text>
      <Text style={emailStyles.fineprint}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <Link href={url} style={emailStyles.link}>
          {url}
        </Link>
      </Text>
      <Text style={emailStyles.fineprint}>
        If you didn&apos;t request this email, you can safely ignore it.
      </Text>
    </BrandedEmail>
  )
}

export default SignInEmail

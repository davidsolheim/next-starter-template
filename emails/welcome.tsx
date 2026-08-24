import * as React from "react"
import { Link, Text } from "@react-email/components"
import { BrandedEmail, EmailButton, emailStyles } from "./components/email-layout"

export function WelcomeEmail({ url, name }: { url: string; name?: string | null }) {
  const greeting = name?.trim() ? `Welcome, ${name.trim()}!` : "Welcome!"
  return (
    <BrandedEmail preview="Set up your account">
      <Text style={emailStyles.heading}>{greeting}</Text>
      <Text style={emailStyles.paragraph}>
        Your account is ready. Set your password to activate it and get started.
      </Text>
      <Text style={emailStyles.buttonWrap}>
        <EmailButton href={url}>Set your password</EmailButton>
      </Text>
      <Text style={emailStyles.fineprint}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <Link href={url} style={emailStyles.link}>
          {url}
        </Link>
      </Text>
      <Text style={emailStyles.fineprint}>
        This link expires in 48 hours. If it has expired, use &ldquo;Forgot
        password&rdquo; on the sign-in page to request a fresh one.
      </Text>
    </BrandedEmail>
  )
}

export default WelcomeEmail

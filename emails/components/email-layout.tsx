import * as React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { fontFamily, theme } from "./theme"

type BrandedEmailProps = {
  preview: string
  children: React.ReactNode
}

const main: React.CSSProperties = {
  backgroundColor: theme.background,
  fontFamily,
  margin: 0,
  padding: "32px 0",
}

const container: React.CSSProperties = {
  backgroundColor: theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
}

const header: React.CSSProperties = {
  backgroundColor: theme.card,
  borderBottom: `1px solid ${theme.border}`,
  padding: "24px 32px",
  textAlign: "center",
}

const content: React.CSSProperties = {
  padding: "32px",
}

const footer: React.CSSProperties = {
  padding: "0 32px 32px",
}

const footerText: React.CSSProperties = {
  color: theme.footerText,
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 4px",
}

function siteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME || "Your app"
}

export function BrandedEmail({ preview, children }: BrandedEmailProps) {
  const name = siteName()
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={{ ...footerText, fontSize: "16px", fontWeight: 700, color: theme.text, margin: 0 }}>
              {name}
            </Text>
          </Section>
          <Section style={content}>{children}</Section>
          <Hr style={{ borderColor: theme.border, margin: "0 32px" }} />
          <Section style={footer}>
            <Text style={{ ...footerText, paddingTop: "16px" }}>
              You&apos;re receiving this email because of your {name} account.
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} {name}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function EmailButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: theme.primary,
        borderRadius: "8px",
        color: "#FFFFFF",
        display: "inline-block",
        fontSize: "16px",
        fontWeight: 600,
        padding: "12px 28px",
        textDecoration: "none",
      }}
    >
      {children}
    </Button>
  )
}

export const emailStyles = {
  heading: {
    color: theme.text,
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: "30px",
    margin: "0 0 16px",
  } as React.CSSProperties,
  paragraph: {
    color: theme.mutedText,
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px",
  } as React.CSSProperties,
  buttonWrap: {
    margin: "24px 0",
  } as React.CSSProperties,
  fineprint: {
    color: theme.footerText,
    fontSize: "13px",
    lineHeight: "20px",
    margin: "16px 0 0",
  } as React.CSSProperties,
  link: {
    color: theme.primary,
    wordBreak: "break-all",
  } as React.CSSProperties,
}

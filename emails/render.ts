import { render } from "@react-email/render"
import { ResetPasswordEmail } from "./reset-password"
import { SignInEmail } from "./sign-in"
import { VerifyEmail } from "./verify-email"
import { WelcomeEmail } from "./welcome"

export function renderSignInEmail({ url }: { url: string }) {
  return render(SignInEmail({ url }))
}

export function renderResetPasswordEmail({ url }: { url: string }) {
  return render(ResetPasswordEmail({ url }))
}

export function renderWelcomeEmail({ url, name }: { url: string; name?: string | null }) {
  return render(WelcomeEmail({ url, name }))
}

export function renderVerifyEmail({ url }: { url: string }) {
  return render(VerifyEmail({ url }))
}

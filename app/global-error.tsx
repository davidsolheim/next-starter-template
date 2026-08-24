"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0f172a",
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: "28rem", lineHeight: 1.6, opacity: 0.85 }}>
          The application failed to load. Please try again.
        </p>
        {error.digest ? (
          <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
            Reference: {error.digest}
          </p>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              cursor: "pointer",
              borderRadius: "0.5rem",
              border: "none",
              padding: "0.6rem 1.25rem",
              fontWeight: 600,
              background: "#ffffff",
              color: "#0f172a",
            }}
          >
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "0.6rem 1.25rem",
              fontWeight: 600,
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            Home
          </a>
        </div>
      </body>
    </html>
  )
}

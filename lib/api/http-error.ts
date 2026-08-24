import { unstable_rethrow } from "next/navigation"
import { NextResponse } from "next/server"

export class HttpError extends Error {
  status: number
  details?: Record<string, unknown>

  constructor(status: number, message: string, details?: Record<string, unknown>) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function errorResponse(error: unknown) {
  unstable_rethrow(error)

  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message, ...(error.details ?? {}) }, { status: error.status })
  }

  console.error("Unhandled API error", error)
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

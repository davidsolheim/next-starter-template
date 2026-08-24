const MAX_BYTES = 8 * 1024 * 1024

const ALLOWED: Record<string, { kind: "image" | "video" | "document"; extensions: string[] }> = {
  "image/png": { kind: "image", extensions: ["png"] },
  "image/jpeg": { kind: "image", extensions: ["jpg", "jpeg"] },
  "image/webp": { kind: "image", extensions: ["webp"] },
  "video/mp4": { kind: "video", extensions: ["mp4"] },
  "application/pdf": { kind: "document", extensions: ["pdf"] },
}

export type UploadValidationError =
  | "file_required"
  | "type_not_allowed"
  | "extension_mismatch"
  | "too_large"
  | "signature_mismatch"

export type ValidatedUpload = {
  kind: "image" | "video" | "document"
  contentType: string
  extension: string
  safeFilename: string
  sizeBytes: number
}

function extensionFor(fileName: string) {
  const parts = fileName.toLowerCase().split(".")
  return parts.length > 1 ? parts.at(-1) ?? "" : ""
}

function safeBaseName(fileName: string) {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "upload"
  )
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte)
}

export async function hasValidSignature(file: File): Promise<boolean> {
  if (file.type === "image/png") {
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer())
    return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  }
  if (file.type === "image/jpeg") {
    const bytes = new Uint8Array(await file.slice(0, 3).arrayBuffer())
    return startsWith(bytes, [0xff, 0xd8, 0xff])
  }
  if (file.type === "image/webp") {
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
    const prefix = String.fromCharCode(...bytes.slice(0, 4))
    const format = String.fromCharCode(...bytes.slice(8, 12))
    return prefix === "RIFF" && format === "WEBP"
  }
  if (file.type === "application/pdf") {
    const bytes = new Uint8Array(await file.slice(0, 5).arrayBuffer())
    return String.fromCharCode(...bytes) === "%PDF-"
  }
  if (file.type === "video/mp4") {
    return file.size > 8
  }
  return false
}

export async function validateUploadFile(file: unknown): Promise<
  { ok: true; value: ValidatedUpload } | { ok: false; error: UploadValidationError }
> {
  if (!(file instanceof File) || file.size <= 0) {
    return { ok: false, error: "file_required" }
  }
  const allowed = ALLOWED[file.type]
  if (!allowed) return { ok: false, error: "type_not_allowed" }
  if (file.size > MAX_BYTES) return { ok: false, error: "too_large" }
  const extension = extensionFor(file.name)
  if (!allowed.extensions.includes(extension)) return { ok: false, error: "extension_mismatch" }
  if (!(await hasValidSignature(file))) return { ok: false, error: "signature_mismatch" }

  return {
    ok: true,
    value: {
      kind: allowed.kind,
      contentType: file.type,
      extension,
      safeFilename: `${safeBaseName(file.name)}.${extension}`,
      sizeBytes: file.size,
    },
  }
}

export function mediaObjectKey(kind: string, assetId: string, safeFilename: string, now = new Date()) {
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `media/${kind}/${year}/${month}/${assetId}-${safeFilename}`
}

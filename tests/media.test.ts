import { describe, expect, test } from "bun:test"
import { hasValidSignature, mediaObjectKey, validateUploadFile } from "@/lib/media/validate-upload"
import { mediaLifecycle } from "@/lib/media/lifecycle"

function pngFile(extra = "") {
  const header = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const body = new TextEncoder().encode(extra)
  const bytes = new Uint8Array(header.length + body.length)
  bytes.set(header)
  bytes.set(body, header.length)
  return new File([bytes], "photo.png", { type: "image/png" })
}

describe("media upload validation", () => {
  test("accepts a PNG signature", async () => {
    const file = pngFile()
    expect(await hasValidSignature(file)).toBe(true)
    const result = await validateUploadFile(file)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.kind).toBe("image")
      expect(result.value.safeFilename).toBe("photo.png")
    }
  })

  test("rejects spoofed PNG bytes", async () => {
    const file = new File(["not a png"], "photo.png", { type: "image/png" })
    expect(await hasValidSignature(file)).toBe(false)
    const result = await validateUploadFile(file)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBe("signature_mismatch")
  })

  test("object keys use dated media prefix and asset id", () => {
    const key = mediaObjectKey("image", "abc123", "photo.png", new Date("2026-06-15"))
    expect(key).toBe("media/image/2026/06/abc123-photo.png")
  })
})

describe("media lifecycle", () => {
  test("purge only when archived and unused", () => {
    expect(mediaLifecycle({ archivedAt: null, usageCount: 0, untrackedUrlRefs: 0 }).canPurge).toBe(false)
    expect(mediaLifecycle({ archivedAt: new Date(), usageCount: 1, untrackedUrlRefs: 0 }).canPurge).toBe(false)
    expect(mediaLifecycle({ archivedAt: new Date(), usageCount: 0, untrackedUrlRefs: 0 }).canPurge).toBe(true)
  })
})

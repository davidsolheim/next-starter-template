import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if Vercel Blob token is available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const randomSuffix = Math.random().toString(36).substring(2, 8) // 6-digit random string
    const extension = file.name.split(".").pop() || "jpg"
    const filename = `image-${randomSuffix}.${extension}`
    const blobPath = `uploads/${year}/${month}/${day}/${filename}`

    if (blobToken) {
      // Upload to Vercel Blob in production
      const blob = await put(blobPath, file, {
        access: "public",
      })

      return NextResponse.json({
        url: blob.url,
        filename: blobPath,
        size: file.size,
        type: file.type,
      })
    } else {
      // Local development fallback - save to public/uploads
      const uploadsDir = join(process.cwd(), "public", "uploads", year.toString(), month, day)

      await mkdir(uploadsDir, { recursive: true })

      const filepath = join(uploadsDir, filename)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      const url = `/uploads/${year}/${month}/${day}/${filename}`

      return NextResponse.json({
        url,
        filename,
        size: file.size,
        type: file.type,
      })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

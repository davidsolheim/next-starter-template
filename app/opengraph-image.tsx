import { ImageResponse } from "next/og"
import { siteName } from "@/lib/site-visibility"

export const alt = "Site preview"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage() {
  const name = siteName()
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#0f172a",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7 }}>Website</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16 }}>{name}</div>
      </div>
    ),
    { ...size },
  )
}

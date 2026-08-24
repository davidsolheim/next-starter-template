import { del, put } from "@vercel/blob"
import type { StorageDriver, StoragePutResult } from "./types"

export function createBlobDriver(): StorageDriver {
  return {
    name: "vercel-blob",
    async put(key, body, contentType): Promise<StoragePutResult> {
      const result = await put(key, body, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType,
      })
      return { key: result.pathname || key, url: result.url }
    },
    async delete(key) {
      await del(key)
    },
  }
}

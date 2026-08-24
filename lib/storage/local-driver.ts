import { mkdir, unlink, writeFile } from "fs/promises"
import { dirname, join } from "path"
import type { StorageDriver, StoragePutResult } from "./types"

export function createLocalDriver(): StorageDriver {
  return {
    name: "local",
    async put(key, body): Promise<StoragePutResult> {
      const filepath = join(process.cwd(), "public", key)
      await mkdir(dirname(filepath), { recursive: true })
      await writeFile(filepath, body)
      return { key, url: `/${key}` }
    },
    async delete(key) {
      try {
        await unlink(join(process.cwd(), "public", key))
      } catch {
        // already gone
      }
    },
  }
}

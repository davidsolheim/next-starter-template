import { createBlobDriver } from "./blob-driver"
import { createLocalDriver } from "./local-driver"
import { isObjectStorageRequired, type StorageDriver } from "./types"

export { isObjectStorageRequired } from "./types"
export type { StorageDriver, StoragePutResult } from "./types"

export function getStorageDriver(env = process.env): StorageDriver | null {
  if (env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return createBlobDriver()
  }
  if (!isObjectStorageRequired(env)) {
    return createLocalDriver()
  }
  return null
}

export function storageNotConfiguredMessage() {
  return "Object storage is not configured. Set BLOB_READ_WRITE_TOKEN for preview/production."
}

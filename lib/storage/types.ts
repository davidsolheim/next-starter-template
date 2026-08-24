export type StoragePutResult = {
  key: string
  url: string
}

export type StorageDriver = {
  name: "local" | "vercel-blob"
  put(key: string, body: Buffer, contentType: string): Promise<StoragePutResult>
  delete(key: string): Promise<void>
}

export function isObjectStorageRequired(env = process.env) {
  return env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "production"
}

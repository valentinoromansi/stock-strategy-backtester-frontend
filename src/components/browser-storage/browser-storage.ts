export type StorageType = 'local' | 'session'
export type StorageKey = "access_token" | 'theme'

export function getItem(storageType: StorageType, key: StorageKey): string {
  if(storageType === "local")
    return localStorage.getItem(key)
  return sessionStorage.getItem(key)
}

export function setItem(storageType: StorageType, key: StorageKey, value: string) {
  if(storageType === "local")
    localStorage.setItem(key, value)
  else
    sessionStorage.setItem(key, value)
}
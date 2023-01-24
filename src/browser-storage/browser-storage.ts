export type StorageType = 'local' | 'session'
export type StorageKey = "access_token" | 'theme'

export function getItem(storageType: StorageType, key: StorageKey): any {
  if(storageType === "local")
    return localStorage.getItem(key)
  return sessionStorage.getItem(key)
}

export function setItem(storageType: StorageType, key: StorageKey, value: string) {
  if(storageType === "local")
    return localStorage.setItem(key, value)
  sessionStorage.setItem(key, value)
}

export function removeItem(storageType: StorageType, key: StorageKey) {
  if(storageType === "local")
    return localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}
type WatchCallback<T> = <K extends keyof T>(
  key: K,
  oldValue: T[K],
  newValue: T[K]
) => void

export function wrapWithPropertyChangeWatcher<T extends object>(
  obj: T,
  callback: WatchCallback<T>
): T {
  return new Proxy(obj, {
    set(target, prop: string | symbol, value) {
      if (prop in target) {
        const key = prop as keyof T
        const oldValue = target[key]
        if (oldValue !== value) {
          target[key] = value
          callback(key, oldValue, value)
        }
      } else {
        // Optionally handle new keys being added
        const key = prop as keyof T
        target[key] = value
        callback(key, undefined as any, value)
      }
      return true
    }
  })
}
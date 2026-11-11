export function expectNever(value: never): never {
  throw new Error(`unreachable route: ${String(value)}`)
}

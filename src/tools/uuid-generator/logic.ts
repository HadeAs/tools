export function generateUUID(): string {
  return crypto.randomUUID()
}

export function generateBatch(count: number): string[] {
  return Array.from({ length: count }, () => generateUUID())
}

export function chunkText(value: string, size = 32000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < value.length; i += size) {
    chunks.push(value.slice(i, i + size));
  }
  return chunks;
}

export function reconstructChunks(
  chunks: { chunkParentId?: string; chunkIndex?: number; content?: string }[],
  chunkParentId: string,
): string {
  return chunks
    .filter((c) => c.chunkParentId === chunkParentId)
    .sort((a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0))
    .map((c) => c.content ?? '')
    .join('');
}

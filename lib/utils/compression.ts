export async function compressTextWithGzip(text: string) {
  const encoder = new TextEncoder();
  const inputStream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    }
  });

  const gzipStream = inputStream.pipeThrough(new CompressionStream('gzip'));
  const compressedResponse = new Response(gzipStream);
  return await compressedResponse.blob();
}

export async function decompressGzipStreamToText(webStream: ReadableStream<unknown>) {
  const decompressedStream = webStream.pipeThrough(
    new DecompressionStream('gzip')
  )
  
  const reader = decompressedStream.getReader()
  const decoder = new TextDecoder('utf-8')
  let result = ''
  
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    if (value) result += decoder.decode(value, { stream: true })
  }
  
  // Flush any remaining characters
  result += decoder.decode()
  
  return result
}
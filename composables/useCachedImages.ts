import SparkMD5 from "spark-md5";

export function useCachedImages() {
  let opfsRoot: FileSystemDirectoryHandle
  let directoryHandle: FileSystemDirectoryHandle

  async function getCachedImagesDir() {
    if (!opfsRoot) {
      opfsRoot = await navigator.storage.getDirectory();
    }
    if (!directoryHandle) {
      directoryHandle = await opfsRoot.getDirectoryHandle("cached images", {
        create: true,
      });
    }
    return directoryHandle
  }

  async function getCachedImageFilename(imageUrl: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle> {
    const dirHandle = await getCachedImagesDir()
    const imageUrlHash = SparkMD5.hash(imageUrl);
    const imageFileHandle = await dirHandle.getFileHandle(imageUrlHash, options);
    return imageFileHandle
  }

  async function getCachedImage(imageUrl: string, headers?: Record<string, string>) {
    let fileHandle: FileSystemFileHandle | undefined = undefined
    try {
      fileHandle = await getCachedImageFilename(imageUrl)
    } catch(error) {
      if (!(error instanceof DOMException) || (error.name !== "NotFoundError")) {
        // It's fine if we get NotFoundError, that just means the file is not cached
        // but if we get anything else that's a problem.
        logger.error(error)
      }
    }
    if (fileHandle) {
      return fileHandle.getFile();
    }

    const response = await fetch(imageUrl, {
      headers: headers ?? {}
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const imageBlob = await response.blob();

    fileHandle = await getCachedImageFilename(imageUrl, {create: true})
    const writable = await fileHandle.createWritable();
    await writable.write(imageBlob);
    await writable.close();

    return imageBlob
  }

  return { getCachedImage }
}
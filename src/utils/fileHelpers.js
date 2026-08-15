/**
 * Helper to convert a File object to a Base64 string.
 * Supports validation for max size and allowed MIME types.
 */
export const fileToBase64 = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const { maxSizeMB, allowedTypes } = options;

    // Validate size if limit provided
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return reject(new Error(`File size exceeds the limit of ${maxSizeMB}MB`));
    }

    // Validate type if array provided
    if (allowedTypes && allowedTypes.length > 0) {
      const isAllowed = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(`${category}/`);
        }
        return file.type === type;
      });
      if (!isAllowed) {
        return reject(new Error(`File type ${file.type} is not allowed.`));
      }
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const base64ToFile = (base64String, filename) => {
  if (!base64String || !base64String.startsWith("data:")) return null;
  try {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (err) {
    console.error("base64ToFile conversion error:", err);
    return null;
  }
};

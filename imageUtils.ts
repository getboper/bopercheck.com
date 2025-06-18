/**
 * Utility functions for image processing in BoperCheck
 */

/**
 * Compresses an image file to reduce size while maintaining quality
 * @param file The image file to compress
 * @param maxSizeMB Maximum size in MB for the compressed image
 * @param maxWidthOrHeight Maximum width or height in pixels
 * @returns Promise resolving to a compressed File object
 */
export const compressImage = async (
  file: File, 
  maxSizeMB: number = 1, 
  maxWidthOrHeight: number = 1200
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      // Create an image element to load the file data
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Create a canvas to resize and compress the image
        const canvas = document.createElement('canvas');
        
        // Calculate the new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = Math.round(height * maxWidthOrHeight / width);
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = Math.round(width * maxWidthOrHeight / height);
            height = maxWidthOrHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image to the canvas with the new dimensions
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get the compressed image data with quality adjustment
        const quality = calculateQuality(file.size, maxSizeMB);
        const compressedDataUrl = canvas.toDataURL(file.type, quality);
        
        // Convert data URL to Blob and then to File
        fetch(compressedDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            
            // If the compressed file is still too large, try again with lower quality
            if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
              compressImage(file, maxSizeMB, maxWidthOrHeight - 200)
                .then(resolve)
                .catch(reject);
            } else {
              resolve(compressedFile);
            }
          })
          .catch(reject);
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};

/**
 * Calculate appropriate quality level based on file size
 * @param originalSize Original file size in bytes
 * @param maxSizeMB Maximum target size in MB
 * @returns Quality value between 0 and 1
 */
const calculateQuality = (originalSize: number, maxSizeMB: number): number => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (originalSize <= maxSizeBytes) {
    return 0.9; // If already under target size, use high quality
  }
  
  // Calculate quality based on ratio of target size to original size
  const ratio = maxSizeBytes / originalSize;
  const quality = Math.max(0.1, Math.min(0.9, ratio * 1.5));
  
  return quality;
};

/**
 * Converts a File object to a base64 string
 * @param file The file to convert
 * @returns Promise resolving to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extract the base64 part without the data URL prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

/**
 * Validates if a file is an acceptable image
 * @param file File to validate
 * @returns Boolean indicating if the file is an acceptable image
 */
export const isValidImage = (file: File): boolean => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return acceptedTypes.includes(file.type);
};
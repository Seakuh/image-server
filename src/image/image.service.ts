// image.service.ts
import { Injectable } from '@nestjs/common';
import { File as MulterFile } from 'multer';

@Injectable()
export class ImageService {
  // This service can be extended to manage image metadata, access control,
  // and other business logic for image uploads and retrieval.
  validateFile(file: MulterFile): boolean {
    // Example: Check file type and size
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 16 * 1024 * 1024; // 16MB

    return (
      allowedMimeTypes.includes(file.mimetype) && file.size <= maxSizeInBytes
    );
  }

  getImageMetadata(filename: string) {
    // Placeholder: Retrieve metadata for the image from a database
    return {
      filename,
      uploadedAt: new Date().toISOString(),
    };
  }
}

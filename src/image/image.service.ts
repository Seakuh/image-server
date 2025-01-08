// image.service.ts
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { join } from 'path';
import * as fs from 'fs';
@Injectable()
export class ImageService {
    private readonly uploadPath = '/var/www/images';

  // This service can be extended to manage image metadata, access control,
  // and other business logic for image uploads and retrieval.
  validateFile(file: Express.Multer.File): boolean {
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

  async transformImage(filename: string, width: number, height: number, quality: number): Promise<string> {
    const inputPath = join(this.uploadPath, filename);
    const transformedPath = join(this.uploadPath, `transformed-${width}x${height}-${filename}`);

    // Prüfe, ob die transformierte Version bereits existiert
    if (fs.existsSync(transformedPath)) {
      return transformedPath;
    }

    // Transformiere das Bild
    await sharp(inputPath)
      .resize(width, height, { fit: 'cover' })
      .jpeg({ quality }) // Qualität einstellen
      .toFile(transformedPath);

    return transformedPath;
  }
}

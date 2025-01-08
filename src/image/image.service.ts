// image.service.ts
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';

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
    // Wenn filename bereits den vollständigen Pfad enthält, diesen verwenden
    const inputPath = filename.startsWith(this.uploadPath)
      ? filename
      : join(this.uploadPath, filename);
  
    const transformedPath = join(this.uploadPath, `transformed-${width}x${height}-${path.basename(filename)}`);
  
    console.log('Input path:', inputPath);
    console.log('Transformed path:', transformedPath);
  
    // Prüfe, ob die transformierte Version bereits existiert
    if (fs.existsSync(transformedPath)) {
      return transformedPath;
    }
  
    // Transformiere das Bild
    try {
      await sharp(inputPath)
        .resize(width, height, { fit: 'cover' })
        .jpeg({ quality }) // Qualität einstellen
        .toFile(transformedPath);
    } catch (error) {
      console.error('Error during image transformation:', error.message);
      throw new Error(`Failed to transform image: ${error.message}`);
    }
  
    return transformedPath;
  }
  
}

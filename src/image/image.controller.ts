import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Controller('images')
export class ImageController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folder?: string },
  ) {
    const folder = body.folder || 'default';

    // Dynamischer Ordnerpfad
    const uploadPath = path.join('/var/www/images', folder);

    // Ordner erstellen, falls nicht vorhanden
    if (!fs.existsSync(uploadPath)) {
      console.log('Creating directory:', uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Dateiname generieren
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const fullPath = path.join(uploadPath, fileName);

    // Datei speichern
    console.log('Saving file to:', fullPath);
    fs.writeFileSync(fullPath, file.buffer);

    return { url: `/images/${folder}/${fileName}` };
  }
}

import { Controller, Post, Body, UploadedFile, UseInterceptors, Query, Get, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

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
  @Get(':filename')
  async getTransformedImage(
    @Param('filename') filename: string,
    @Query('width') width: string,
    @Query('height') height: string,
    @Query('quality') quality: string,
    @Res() res: Response,
  ) {
    const imageWidth = parseInt(width) || 300; // Standardwerte
    const imageHeight = parseInt(height) || 300;
    const imageQuality = parseInt(quality) || 75;

    try {
      const filePath = await this.imageService.transformImage(
        filename,
        imageWidth,
        imageHeight,
        imageQuality,
      );
      return res.sendFile(filePath);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

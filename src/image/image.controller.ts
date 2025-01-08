import { Controller, Get, Post, Query, Res, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import * as fs from 'fs';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  private readonly uploadPath = '/var/www/images';

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req.body.folder || 'default'; // Ordner aus Anfrage oder Standard-Ordner
          const uploadPath = `/var/www/images/${folder}`;

          // Ordner erstellen, falls nicht vorhanden
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: { folder?: string }) {
    const folder = body.folder || 'default';
    return { url: `/images/${folder}/${file.filename}` };
  }
}

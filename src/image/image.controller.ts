import { Controller, Get, Post, Query, Res, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

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
        destination: '/var/www/images',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/images/${file.filename}` };
  }
}

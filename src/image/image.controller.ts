import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  private readonly uploadPath = '/var/www/images'; // Persistentes Verzeichnis

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/var/www/images', // Speicherort ändern
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/images/${file.filename}` }; // Rückgabe der URL
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(this.uploadPath, filename); // Pfad anpassen
    return res.sendFile(filePath);
  }
}

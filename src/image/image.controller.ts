import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    Query,
    Get,
    Res,
    Param,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { v4 as uuidv4 } from 'uuid';
  import * as fs from 'fs';
  import * as path from 'path';
  import { Response } from 'express';
import { ImageService } from './image.service';
  
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
  
    @Get('*')
    async getTransformedImage(
      @Param() params: any,
      @Query('width') width: string,
      @Query('height') height: string,
      @Query('quality') quality: string,
      @Res() res: Response,
    ) {
      const fullPath = params['0']; // Captures the full wildcard path
      const imageWidth = parseInt(width) || 300; // Standardwerte
      const imageHeight = parseInt(height) || 300;
      const imageQuality = parseInt(quality) || 75;
  
      // Bildpfad
      const filePath = path.join('/var/www/images', fullPath);
  
      // Überprüfen, ob die Datei existiert
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      try {
        // Transformation durch ImageService
        const transformedPath = await this.imageService.transformImage(
          filePath,
          imageWidth,
          imageHeight,
          imageQuality,
        );
        return res.sendFile(transformedPath);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  }
  
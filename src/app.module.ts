import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ImageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/images', // Öffentlich zugänglich unter /images
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

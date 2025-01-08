import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

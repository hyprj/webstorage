import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './db/drizzle.module';
import { FoldersModule } from './modules/folders/folders.module';

@Module({
  imports: [DrizzleModule, FoldersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

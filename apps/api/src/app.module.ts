import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './db/drizzle.module';
import { FilesModule } from './modules/files/files.module';
import { FoldersModule } from './modules/folders/folders.module';
import { TrashModule } from './modules/trash/trash.module';
import { DefaultRetentionModule } from './modules/dataRetention/defaultRetention/default-retention.module';
import { RetentionPoliciesModule } from './modules/dataRetention/retentionPolicies/retention-policies.module';

@Module({
  imports: [
    DrizzleModule,
    FoldersModule,
    FilesModule,
    TrashModule,
    DefaultRetentionModule,
    RetentionPoliciesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AssestService } from './assest.service';
import { AssestController } from './assest.controller';

@Module({
  controllers: [AssestController],
  providers: [AssestService]
})
export class AssestModule {}

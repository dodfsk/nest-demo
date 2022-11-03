import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { AssetsService } from '../assets/assets.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService,AssetsService],
  exports: [RoomService]
})
export class RoomModule {}

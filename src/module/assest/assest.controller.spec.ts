import { Test, TestingModule } from '@nestjs/testing';
import { AssestController } from './assest.controller';
import { AssestService } from './assest.service';

describe('AssestController', () => {
  let controller: AssestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssestController],
      providers: [AssestService],
    }).compile();

    controller = module.get<AssestController>(AssestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

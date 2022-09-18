import { Test, TestingModule } from '@nestjs/testing';
import { AssestService } from './assest.service';

describe('AssestService', () => {
  let service: AssestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssestService],
    }).compile();

    service = module.get<AssestService>(AssestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

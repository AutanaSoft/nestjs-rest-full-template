/**
 * Pruebas unitarias para GetHelloUseCase.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { GetHelloUseCase } from './get-hello.use-case';

describe('GetHelloUseCase', () => {
  let useCase: GetHelloUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetHelloUseCase],
    }).compile();

    useCase = module.get<GetHelloUseCase>(GetHelloUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return "Hello World!"', () => {
      const result = useCase.execute();
      expect(result.message).toBe('Hello World!');
    });
  });
});

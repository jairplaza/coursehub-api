import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import type { AuthController as AuthControllerType } from './auth.controller';
import type { AuthService as AuthServiceType } from './auth.service';

type AuthControllerConstructor = new (...args: unknown[]) => AuthControllerType;
type AuthServiceToken = abstract new (...args: unknown[]) => AuthServiceType;

jest.unstable_mockModule('@nestjs/throttler', () => ({
  Throttle: () => () => undefined,
  SkipThrottle: () => () => undefined,
  ThrottlerGuard: class {
    canActivate() {
      return true;
    }
  },
  ThrottlerModule: class {
    static forRoot() {
      return { module: this };
    }
    static forRootAsync() {
      return { module: this };
    }
  },
}));

describe('AuthController', () => {
  let controller: AuthControllerType;

  const mockAuthService = {
    register: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    login: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const loadModule = new Function(
      'modulePath',
      'return import(modulePath);',
    ) as (modulePath: string) => Promise<Record<string, unknown>>;

    const controllerMod = await loadModule('./auth.controller.ts');
    const serviceMod = await loadModule('./auth.service.ts');

    const AuthController = controllerMod.AuthController as AuthControllerConstructor;
    const AuthService = serviceMod.AuthService as AuthServiceToken;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

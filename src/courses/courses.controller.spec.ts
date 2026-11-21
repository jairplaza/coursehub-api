import { jest } from '@jest/globals';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../users/user-role.enum';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case';

describe('CoursesController', () => {
  let controller: CoursesController;

  const coursesService = {
    create: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    findAll: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    findOne: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    remove: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };

  const updateCourseUseCase = {
    execute: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        { provide: CoursesService, useValue: coursesService },
        { provide: UpdateCourseUseCase, useValue: updateCourseUseCase },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate course update to UpdateCourseUseCase', async () => {
    const updated = { id: 1, title: 'NestJS Avanzado' };
    updateCourseUseCase.execute.mockResolvedValueOnce(updated);

    const req = { user: { id: 1, role: UserRole.ADMIN } };
    const result = await controller.update(
      1,
      { title: 'NestJS Avanzado' },
      req as never,
    );

    expect(updateCourseUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it('should propagate ForbiddenException when UpdateCourseUseCase rejects', async () => {
    updateCourseUseCase.execute.mockRejectedValueOnce(
      new ForbiddenException('Forbidden'),
    );

    const req = { user: { id: 2, role: UserRole.TEACHER } };

    await expect(
      controller.update(1, { title: 'Nuevo título' }, req as never),
    ).rejects.toThrow(ForbiddenException);
  });
});

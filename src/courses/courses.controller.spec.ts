import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../users/user-role.enum';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case';

describe('CoursesController', () => {
  let controller: CoursesController;

  const coursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const updateCourseUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        { provide: CoursesService, useValue: coursesService },
        { provide: UpdateCourseUseCase, useValue: updateCourseUseCase },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    jest.clearAllMocks();
  });

  it('delegates update with id, dto, and authenticated user from req.user', async () => {
    const actor = { id: 4, role: UserRole.TEACHER };
    const req = { user: actor };
    const dto = { title: 'NestJS avanzado' };
    const expected = { id: 7, ...dto };
    updateCourseUseCase.execute.mockResolvedValue(expected);

    await expect(controller.update(7, dto as any, req)).resolves.toEqual(expected);
    expect(updateCourseUseCase.execute).toHaveBeenCalledWith(7, dto, actor);
  });

  it('propagates errors thrown by UpdateCourseUseCase', async () => {
    const actor = { id: 9, role: UserRole.TEACHER };
    const req = { user: actor };
    const dto = { title: 'Cambio no autorizado' };
    updateCourseUseCase.execute.mockRejectedValue(
      new ForbiddenException('You cannot modify this course'),
    );

    await expect(controller.update(7, dto as any, req)).rejects.toThrow(
      ForbiddenException,
    );
    expect(updateCourseUseCase.execute).toHaveBeenCalledWith(7, dto, actor);
  });
});

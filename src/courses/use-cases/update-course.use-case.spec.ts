import { jest } from '@jest/globals';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { COURSE_REPOSITORY } from '../domain/course.repository';
import { Course } from '../entities/course.entity';
import { UserRole } from '../../users/user-role.enum';
import { UpdateCourseUseCase } from './update-course.use-case';

describe('UpdateCourseUseCase', () => {
  let useCase: UpdateCourseUseCase;

  const courses = {
    findById: jest.fn<(id: number) => Promise<Course | null>>(),
    save: jest.fn<(course: Course) => Promise<Course>>(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateCourseUseCase,
        { provide: COURSE_REPOSITORY, useValue: courses },
      ],
    }).compile();

    useCase = moduleRef.get(UpdateCourseUseCase);
    jest.clearAllMocks();
  });

  it('allows the owner teacher to update a course', async () => {
    // Arrange
    const course = { id: 7, title: 'NestJS', createdByUserId: 4 } as Course;
    courses.findById.mockResolvedValue(course);
    courses.save.mockImplementation(async (value) => value);

    // Act
    const result = await useCase.execute(
      7,
      { title: 'NestJS avanzado' },
      { id: 4, role: UserRole.TEACHER },
    );

    // Assert
    expect(result.title).toBe('NestJS avanzado');
    expect(courses.save).toHaveBeenCalledWith(course);
  });

  it('throws NotFoundException when the course does not exist', async () => {
    // Arrange
    courses.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute(
        999,
        { title: 'Curso inexistente' },
        { id: 4, role: UserRole.TEACHER },
      ),
    ).rejects.toThrow(NotFoundException);

    expect(courses.save).not.toHaveBeenCalled();
  });

  it('rejects an update from a different teacher', async () => {
    // Arrange
    courses.findById.mockResolvedValue({
      id: 7,
      title: 'NestJS',
      createdByUserId: 4,
    } as Course);

    // Act & Assert
    await expect(
      useCase.execute(
        7,
        { title: 'Cambio no autorizado' },
        { id: 9, role: UserRole.TEACHER },
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(courses.save).not.toHaveBeenCalled();
  });

  it('allows an admin to update a course created by another user', async () => {
    // Arrange
    const course = { id: 7, title: 'NestJS', createdByUserId: 4 } as Course;
    courses.findById.mockResolvedValue(course);
    courses.save.mockImplementation(async (value) => value);

    // Act
    const result = await useCase.execute(
      7,
      { title: 'NestJS actualizado por admin' },
      { id: 1, role: UserRole.ADMIN },
    );

    // Assert
    expect(result.title).toBe('NestJS actualizado por admin');
    expect(courses.save).toHaveBeenCalledWith(course);
  });
});

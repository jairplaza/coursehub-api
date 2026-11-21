import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from '../courses/courses.service';
import { StudentsService } from '../students/students.service';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from './entities/enrollment.entity';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  const mockEnrollmentRepository = {
    find: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    findOne: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    findOneBy: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    create: jest.fn<(...args: unknown[]) => unknown>(),
    save: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    remove: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };

  const mockStudentsService = {
    findOne: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };

  const mockCoursesService = {
    findOne: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepository,
        },
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

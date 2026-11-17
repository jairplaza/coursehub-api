import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { CourseRepository } from '../domain/course.repository';
import { COURSE_REPOSITORY } from '../domain/course.repository';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { UserRole } from '../../users/user-role.enum';

// Interfaz para representar al usuario autenticado que realiza la acción
interface AuthenticatedUser {
  id: number;
  role: UserRole;
}

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courses: CourseRepository,
  ) {}

  async execute(id: number, changes: UpdateCourseDto, actor: AuthenticatedUser) {
    const course = await this.courses.findById(id);
    if (!course) throw new NotFoundException('Course not found');
    
    // Regla de negocio / Autorización de propiedad
    if (actor.role !== UserRole.ADMIN && course.createdByUserId !== actor.id) {
      throw new ForbiddenException('You cannot modify this course');
    }
    
    Object.assign(course, changes);
    return this.courses.save(course);
  }
}


import { 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';

export type Enrollment = {
  id: number;
  studentId: string;
  courseId: number;
};

@Injectable()
export class EnrollmentsService {
  private readonly enrollments: Enrollment[] = [];
  private nextId = 1;

  constructor(
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
  ) {}

  create(dto: CreateEnrollmentDto): Enrollment {
    // 1. Validar que el estudiante exista (pasa el UUID directamente)
    const student = this.studentsService.findOne(dto.studentId);
    if (!student) {
      throw new NotFoundException(`El estudiante con ID ${dto.studentId} no existe`);
    }

    // 2. Validar que el estudiante esté activo
    if (!student.isActive) {
      throw new BadRequestException(`El estudiante con ID ${dto.studentId} está inactivo`);
    }

    // 3. Validar que el curso exista (pasa el número directamente)
    const course = this.coursesService.findOne(dto.courseId);
    if (!course) {
      throw new NotFoundException(`El curso con ID ${dto.courseId} no existe`);
    }

    // 4. Validar que no exista matrícula duplicada
    const exists = this.enrollments.some(
      (e) => e.studentId === dto.studentId && e.courseId === dto.courseId,
    );
    if (exists) {
      throw new ConflictException('El estudiante ya está matriculado en este curso');
    }

    const newEnrollment: Enrollment = {
      id: this.nextId++,
      studentId: dto.studentId,
      courseId: dto.courseId,
    };

    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  findAll(studentId?: string, courseId?: number): Enrollment[] {
    return this.enrollments.filter((e) => {
      const matchStudent = studentId ? e.studentId === studentId : true;
      const matchCourse = courseId ? e.courseId === courseId : true;
      return matchStudent && matchCourse;
    });
  }

  findByStudent(studentId: string): Enrollment[] {
    return this.enrollments.filter((e) => e.studentId === studentId);
  }

  findByCourse(courseId: number): Enrollment[] {
    return this.enrollments.filter((e) => e.courseId === courseId);
  }

  remove(id: number): { message: string } {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`La matrícula con ID ${id} no existe`);
    }
    this.enrollments.splice(index, 1);
    return { message: `Matrícula con ID ${id} cancelada con éxito` };
  }
}

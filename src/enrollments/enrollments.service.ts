import { 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
  ) {}

  // 1. Crear matrícula con validaciones persistentes
  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    // Validar que el estudiante exista y esté activo
    const student = await this.studentsService.findOne(dto.studentId);
    if (!student.isActive) {
      throw new BadRequestException(`El estudiante con ID ${dto.studentId} está inactivo`);
    }

    // Validar que el curso exista
    const course = await this.coursesService.findOne(dto.courseId);

    // Validar que no exista matrícula duplicada en la base de datos
    const exists = await this.enrollmentRepository.findOne({
      where: {
        student: { id: dto.studentId },
        course: { id: dto.courseId },
      },
    });

    if (exists) {
      throw new ConflictException('El estudiante ya está matriculado en este curso');
    }

    const newEnrollment = this.enrollmentRepository.create({
      student,
      course,
    });

    return await this.enrollmentRepository.save(newEnrollment);
  }

  // 2. Obtener todas las matrículas (con filtros opcionales)
  async findAll(studentId?: string, courseId?: number): Promise<Enrollment[]> {
    const where: any = {};
    if (studentId) where.student = { id: studentId };
    if (courseId) where.course = { id: courseId };

    return await this.enrollmentRepository.find({ where });
  }

  // 3. Obtener una matrícula por ID
  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException(`La matrícula con ID ${id} no existe`);
    }
    return enrollment;
  }

  // 4. Buscar matrículas por estudiante
  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { student: { id: studentId } },
    });
  }

  // 5. Buscar matrículas por curso
  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { course: { id: courseId } },
    });
  }

  // 6. Eliminar (cancelar) matrícula
  async remove(id: number): Promise<{ message: string }> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
    return { message: `Matrícula con ID ${id} cancelada con éxito` };
  }
}
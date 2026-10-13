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
import { EnrollmentsQueryDto } from './dto/enrollments-query.dto';
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

  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    // 1. Validar si el estudiante existe y si está activo (lanza 404 o 400)
    const student = await this.studentsService.findOne(dto.studentId);
    if (!student.isActive) {
      throw new BadRequestException(`El estudiante con ID ${dto.studentId} está inactivo y no puede matricularse.`);
    }

    // 2. Validar si el curso existe (lanza 404)
    const course = await this.coursesService.findOne(dto.courseId);

    // 3. Validar si ya existe la matrícula (lanza 409)
    const exists = await this.enrollmentRepository.findOne({
      where: {
        student: { id: dto.studentId },
        course: { id: dto.courseId },
      },
    });

    if (exists) {
      throw new ConflictException('El estudiante ya está matriculado en este curso.');
    }

    // 4. Crear y guardar
    const newEnrollment = this.enrollmentRepository.create({
      student,
      course,
    });

    return await this.enrollmentRepository.save(newEnrollment);
  }

  async findAll(query: EnrollmentsQueryDto) {
    const { search, studentId, courseId, activeOnly, page, limit } = query;

    const qb = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'course');

    // Búsqueda textual por nombre de estudiante o título de curso con parámetros seguros (ILIKE)
    if (search) {
      qb.andWhere('(student.name ILIKE :search OR course.title ILIKE :search)', {
        search: `%${search.trim()}%`,
      });
    }

    // Filtro por ID de estudiante
    if (studentId) {
      qb.andWhere('student.id = :studentId', { studentId });
    }

    // Filtro por ID de curso
    if (courseId) {
      qb.andWhere('course.id = :courseId', { courseId });
    }

    // Filtro por estudiantes activos
    if (activeOnly === 'true') {
      qb.andWhere('student.isActive = :active', { active: true });
    }

    // Ordenamiento estable y paginación
    qb.orderBy('enrollment.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException(`La matrícula con ID ${id} no existe.`);
    }
    return enrollment;
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { student: { id: studentId } },
    });
  }

  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { course: { id: courseId } },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
    return { message: `Matrícula con ID ${id} cancelada con éxito.` };
  }
}

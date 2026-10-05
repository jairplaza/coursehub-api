import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // 1. Crear estudiante (valida correo único en la base de datos)
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const emailExists = await this.studentRepository.findOne({ 
      where: { email: createStudentDto.email } 
    });
    
    if (emailExists) {
      throw new ConflictException(`El correo ${createStudentDto.email} ya está registrado`);
    }

    const newStudent = this.studentRepository.create({
      ...createStudentDto,
      isActive: createStudentDto.isActive ?? true,
    });

    return await this.studentRepository.save(newStudent);
  }

  // 2. Consultar todos con filtros opcionales combinados
  async findAll(filters?: FilterStudentsDto): Promise<Student[]> {
    const where: any = {};

    if (filters?.career) {
      where.career = filters.career; // TypeORM permite filtrar directamente
    }

    if (filters?.semester !== undefined) {
      where.semester = filters.semester;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return await this.studentRepository.find({ where });
  }

  // 3. Consultar por ID
  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return student;
  }

  // 4. Modificación parcial (protege el ID y valida email único)
  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const emailExists = await this.studentRepository.findOne({ 
        where: { email: updateStudentDto.email } 
      });
      if (emailExists) {
        throw new ConflictException(`El correo ${updateStudentDto.email} ya está registrado`);
      }
    }

    // Fusiona los nuevos datos con el estudiante encontrado
    Object.assign(student, updateStudentDto);

    return await this.studentRepository.save(student);
  }

  // 5. Cambiar únicamente el estado activo/inactivo
  async changeStatus(id: string, isActive?: boolean): Promise<Student> {
    const student = await this.findOne(id);
    student.isActive = isActive !== undefined ? isActive : !student.isActive;
    return await this.studentRepository.save(student);
  }

  // 6. Eliminar (Impide eliminar si está inactivo)
  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);

    if (!student.isActive) {
      throw new BadRequestException('No se puede eliminar a un estudiante inactivo');
    }

    await this.studentRepository.remove(student);
  }
}

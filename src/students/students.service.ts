import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { Student } from './interfaces/student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';

@Injectable()
export class StudentsService {
  private students: Student[] = [];

  // 1. Crear estudiante (valida correo único)
  create(createStudentDto: CreateStudentDto): Student {
    const emailExists = this.students.some((s) => s.email === createStudentDto.email);
    if (emailExists) {
      throw new ConflictException(`El correo ${createStudentDto.email} ya está registrado`);
    }

    const newStudent: Student = {
      id: crypto.randomUUID(),
      ...createStudentDto,
      isActive: createStudentDto.isActive ?? true,
    };

    this.students.push(newStudent);
    return newStudent;
  }

  // 2. Consultar todos con filtros opcionales combinados
  findAll(filters?: FilterStudentsDto): Student[] {
    let result = this.students;

    if (filters?.career) {
      const careerFilter = filters.career.toLowerCase();
      result = result.filter(
        (s) => s.career.toLowerCase() === careerFilter,
      );
    }

    if (filters?.semester !== undefined) {
      result = result.filter((s) => s.semester === filters.semester);
    }

    if (filters?.isActive !== undefined) {
      result = result.filter((s) => s.isActive === filters.isActive);
    }

    return result;
  }

  // 3. Consultar por ID
  findOne(id: string): Student {
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return student;
  }

  // 4. Modificación parcial (protege el ID y valida email único)
  update(id: string, updateStudentDto: UpdateStudentDto): Student {
    const student = this.findOne(id);

    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const emailExists = this.students.some((s) => s.email === updateStudentDto.email);
      if (emailExists) {
        throw new ConflictException(`El correo ${updateStudentDto.email} ya está registrado`);
      }
    }

    const index = this.students.findIndex((s) => s.id === id);

    const updatedStudent: Student = {
      ...student,
      ...updateStudentDto,
      id: student.id,
    };

    this.students[index] = updatedStudent;
    return updatedStudent;
  }

  // 5. Cambiar únicamente el estado activo/inactivo
  changeStatus(id: string, isActive?: boolean): Student {
    const student = this.findOne(id);
    student.isActive = isActive !== undefined ? isActive : !student.isActive;
    return student;
  }

  // 6. Eliminar (Impide eliminar si está inactivo)
  remove(id: string): void {
    const student = this.findOne(id);

    if (!student.isActive) {
      throw new BadRequestException('No se puede eliminar a un estudiante inactivo');
    }

    this.students = this.students.filter((s) => s.id !== id);
  }
}


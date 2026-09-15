import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentsDto } from './dto/filter-students.dto';
import { ParseSemesterPipe } from './pipes/parse-semester.pipe';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // 1. Crear un estudiante
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // 2. Obtener todos los estudiantes (con filtros opcionales)
  @Get()
  findAll(@Query() filterDto: FilterStudentsDto) {
    return this.studentsService.findAll(filterDto);
  }

  // 3. Endpoint usando el Pipe Personalizado
  @Get('semester/:semester')
  findBySemester(@Param('semester', ParseSemesterPipe) semester: number) {
    return this.studentsService.findAll({ semester });
  }

  // 4. Buscar estudiante por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  // 5. Modificación parcial de un estudiante
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  // 6. Cambiar exclusivamente el estado activo/inactivo
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string, 
    @Body('isActive') isActive?: boolean
  ) {
    return this.studentsService.changeStatus(id, isActive);
  }

  // 7. Eliminar estudiante (devuelve status 204 sin contenido)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Punto 3: Registrar una matrícula (POST /enrollments)
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  // Punto 4: Consultar con filtros opcionales (GET /enrollments?studentId=1&courseId=2)
  @Get()
  findAll(
    @Query('studentId', new ParseIntPipe({ optional: true })) studentId?: number,
    @Query('courseId', new ParseIntPipe({ optional: true })) courseId?: number,
  ) {
    return this.enrollmentsService.findAll(studentId, courseId);
  }

  // Punto 4: GET /students/:studentId/enrollments (se mapea a /enrollments/students/:studentId)
  @Get('students/:studentId/enrollments')
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  // Punto 4: GET /courses/:courseId/enrollments (se mapea a /enrollments/courses/:courseId)
  @Get('courses/:courseId/enrollments')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  // Punto 4 y 5: Cancelar matrícula e incluir Pipe de transformación (DELETE /enrollments/:id)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}

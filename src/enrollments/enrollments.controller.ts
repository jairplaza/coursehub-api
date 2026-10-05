import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Get()
  findAll(
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.findAll(
      studentId, 
      courseId ? Number(courseId) : undefined
    );
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(Number(courseId));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(Number(id));
  }
}

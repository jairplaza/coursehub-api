import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll(
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.findAll(
      studentId,
      courseId ? +courseId : undefined,
    );
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}

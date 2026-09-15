import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  private courses: any[] = [];

  create(createCourseDto: CreateCourseDto) {
    const newCourse = {
      id: (this.courses.length + 1).toString(),
      ...createCourseDto,
    };
    this.courses.push(newCourse);
    return newCourse;
  }
}


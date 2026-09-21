import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';

export type Course = {
  id: number;
  title: string;
  description: string;
};

@Injectable()
export class CoursesService {
  private courses: Course[] = [];
  private nextId = 1;

  create(createCourseDto: CreateCourseDto): Course {
    const newCourse: Course = {
      id: this.nextId++,
      ...createCourseDto,
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  findAll(): Course[] {
    return this.courses;
  }

  findOne(id: number): Course {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`El curso con ID ${id} no existe`);
    }
    return course;
  }
}
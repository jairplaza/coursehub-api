import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesQueryDto } from './dto/courses-query.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const courseExists = await this.courseRepository.findOne({
      where: { title: createCourseDto.title },
    });

    if (courseExists) {
      throw new ConflictException(`Ya existe un curso con el título "${createCourseDto.title}"`);
    }

    const newCourse = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(newCourse);
  }

  async findAll(query: CoursesQueryDto) {
    const { level, page, limit, sortBy, order } = query;

    const whereCondition: any = {};
    if (level) {
      whereCondition.level = level;
    }

    const [items, total] = await this.courseRepository.findAndCount({
      where: whereCondition,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

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

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    if (updateCourseDto.title && updateCourseDto.title !== course.title) {
      const courseExists = await this.courseRepository.findOne({
        where: { title: updateCourseDto.title },
      });
      if (courseExists) {
        throw new ConflictException(`Ya existe un curso con el título "${updateCourseDto.title}"`);
      }
    }

    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }
}

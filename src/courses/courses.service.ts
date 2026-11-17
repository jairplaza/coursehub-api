import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesQueryDto } from './dto/courses-query.dto';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto, actor: any): Promise<Course> {
    const courseExists = await this.coursesRepository.findOne({
      where: { title: createCourseDto.title },
    });

    if (courseExists) {
      throw new ConflictException(`Ya existe un curso con el título "${createCourseDto.title}"`);
    }

    const newCourse = this.coursesRepository.create({
      ...createCourseDto,
      createdByUserId: actor.id, // Asigna el ID del usuario autenticado como creador
    });
    return await this.coursesRepository.save(newCourse);
  }

  async findAll(query: CoursesQueryDto) {
    const { level, page, limit, sortBy, order } = query;

    const whereCondition: any = {};
    if (level) {
      whereCondition.level = level;
    }

    const [items, total] = await this.coursesRepository.findAndCount({
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
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, actor: any): Promise<Course> {
    const course = await this.findOne(id);

    // Validación de propiedad y roles de la Sesión 19
    const canManageAny = actor.role === UserRole.ADMIN;
    const isOwner = course.createdByUserId === actor.id;

    if (!canManageAny && !isOwner) {
      throw new ForbiddenException('No tienes permiso para modificar este curso');
    }

    if (updateCourseDto.title && updateCourseDto.title !== course.title) {
      const courseExists = await this.coursesRepository.findOne({
        where: { title: updateCourseDto.title },
      });
      if (courseExists) {
        throw new ConflictException(`Ya existe un curso con el título "${updateCourseDto.title}"`);
      }
    }

    Object.assign(course, updateCourseDto);
    return await this.coursesRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
  }
}


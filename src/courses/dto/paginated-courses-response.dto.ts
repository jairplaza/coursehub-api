import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entities/course.entity';

export class PaginatedCoursesResponseDto {
  @ApiProperty({
    type: () => [Course],
    description: 'Listado de cursos de la página actual',
  })
  items: Course[];

  @ApiProperty({ example: 10, required: false })
  total?: number;

  @ApiProperty({ example: 1, required: false })
  page?: number;

  @ApiProperty({ example: 10, required: false })
  limit?: number;
}



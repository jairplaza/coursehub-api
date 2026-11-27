import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsInt } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Pruebas End-to-End con NestJS',
    description: 'Título del curso (mínimo 3 caracteres)',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  @ApiProperty({
    example: 'Curso enfocado en pruebas de integración y calidad de APIs',
    description: 'Descripción del curso',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    example: 4,
    description: 'Cantidad de créditos del curso (número entero)',
    type: Number,
  })
  @IsInt()
  readonly credits: number;

  @ApiProperty({
    example: 5,
    description: 'Semestre del curso (número entero)',
    type: Number,
  })
  @IsInt()
  readonly semester: number;
}

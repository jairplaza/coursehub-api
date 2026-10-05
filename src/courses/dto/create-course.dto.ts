import { IsString, IsNotEmpty, MinLength, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsInt()
  readonly credits: number;

  @IsInt()
  readonly semester: number;
}

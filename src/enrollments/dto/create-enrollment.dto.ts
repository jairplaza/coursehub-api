import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsInt()
  @IsPositive()
  courseId: number;
}


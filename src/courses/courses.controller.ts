import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesQueryDto } from './dto/courses-query.dto';
import { PaginatedCoursesResponseDto } from './dto/paginated-courses-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case';

@ApiTags('Courses')
@ApiBearerAuth('bearer')
@Controller({ path: 'courses', version: '1' })
@UseGuards(AuthGuard('jwt')) // Protege todas las rutas de este controlador exigiendo JWT válido
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly updateCourseUseCase: UpdateCourseUseCase, // <--- Inyectamos el caso de uso
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Crear un curso (requiere rol ADMIN o TEACHER)' })
  @ApiResponse({ status: 201, description: 'Curso creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes para el rol actual' })
  create(@Body() createCourseDto: CreateCourseDto, @Req() req: any) {
    return this.coursesService.create(createCourseDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cursos paginados' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de cursos',
    type: PaginatedCoursesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido' })
  findAll(@Query() query: CoursesQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un curso por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador numérico del curso' })
  @ApiResponse({ status: 200, description: 'Detalle del curso encontrado' })
  @ApiResponse({ status: 400, description: 'El parámetro id debe ser un número entero válido' })
  @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Actualizar un curso existente (requiere rol ADMIN o TEACHER)' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador numérico del curso' })
  @ApiResponse({ status: 200, description: 'Curso actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Parámetro id o datos de actualización inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes para el rol actual' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: any,
  ) {
    // Usamos el caso de uso en lugar del servicio tradicional para el flujo de actualización
    return this.updateCourseUseCase.execute(id, updateCourseDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un curso por ID (requiere rol ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador numérico del curso' })
  @ApiResponse({ status: 200, description: 'Curso eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'El parámetro id debe ser un número entero válido' })
  @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido' })
  @ApiResponse({ status: 403, description: 'Se requiere rol ADMIN para eliminar cursos' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}

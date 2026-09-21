"# CourseHub API" 
## Tabla de Endpoints de la API

| Módulo | Método | Endpoint | Descripción | Parámetros / Query / Body |
| :--- | :---: | :--- | :--- | :--- |
| **Courses** | `POST` | `/courses` | Crear un nuevo curso | **Body**: `CreateCourseDto` |
| **Courses** | `GET` | `/courses` | Obtener lista de todos los cursos | N/A |
| **Courses** | `GET` | `/courses/:id` | Obtener detalle de un curso | **Param**: `id` (number) |
| **Students** | `POST` | `/students` | Registrar un nuevo estudiante | **Body**: `CreateStudentDto` |
| **Students** | `GET` | `/students` | Obtener lista de todos los estudiantes | N/A |
| **Students** | `GET` | `/students/:id` | Obtener detalle de un estudiante | **Param**: `id` (number) |
| **Enrollments** | `POST` | `/enrollments` | Registrar matrícula con validaciones | **Body**: `CreateEnrollmentDto` |
| **Enrollments** | `GET` | `/enrollments` | Consultar matrículas con filtros opcionales | **Query**: `studentId?`, `courseId?` |
| **Enrollments** | `GET` | `/enrollments/students/:studentId/enrollments` | Consultar matrículas de un estudiante | **Param**: `studentId` (number) |
| **Enrollments** | `GET` | `/enrollments/courses/:courseId/enrollments` | Consultar matrículas de un curso | **Param**: `courseId` (number) |
| **Enrollments** | `DELETE` | `/enrollments/:id` | Cancelar/eliminar una matrícula por ID | **Param**: `id` (number) |
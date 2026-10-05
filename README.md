# CourseHub API

API REST desarrollada con **NestJS**, **TypeORM** y **PostgreSQL** para la gestión integral de estudiantes, cursos y matrículas, aplicando validaciones estrictas y reglas de negocio robustas.

---

## Requisitos del Sistema y PostgreSQL

Antes de iniciar el proyecto, asegúrate de contar con lo siguiente:
* **Node.js** (versión 18 o superior recomendada).
* **PostgreSQL** instalado y ejecutándose localmente (o mediante contenedor Docker).
* Una base de datos creada en PostgreSQL para este proyecto (por ejemplo: `coursehub_db`).

---

##  Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la plantilla del archivo `.env.example`. Las variables necesarias son:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto en el que correrá la aplicación | `3000` |
| `DB_HOST` | Host de la base de datos PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario administrador de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de acceso a la base de datos | `tu_contraseña` |
| `DB_NAME` | Nombre de la base de datos del proyecto | `coursehub_db` |

---

## 📋 Tabla de Endpoints de la API

| Módulo | Método | Endpoint | Descripción | Parámetros / Query / Body |
| :--- | :--- | :--- | :--- | :--- |
| **Courses** | `POST` | `/courses` | Crear un nuevo curso | **Body**: `CreateCourseDto` |
| **Courses** | `GET` | `/courses` | Obtener lista de todos los cursos | `N/A`[cite: 12] |
| **Courses** | `GET` | `/courses/:id` | Obtener detalle de un curso | **Param**: `id` (number)[cite: 12] |
| **Students** | `POST` | `/students` | Registrar un nuevo estudiante | **Body**: `CreateStudentDto`[cite: 12] |
| **Students** | `GET` | `/students` | Obtener lista de todos los estudiantes | `N/A`[cite: 12] |
| **Students** | `GET` | `/students/:id` | Obtener detalle de un estudiante | **Param**: `id` (string / UUID)[cite: 12] |
| **Enrollments** | `POST` | `/enrollments` | Registrar matrícula con validaciones | **Body**: `CreateEnrollmentDto`[cite: 12] |
| **Enrollments** | `GET` | `/enrollments` | Consultar matrículas con filtros opcionales | **Query**: `studentId` (string), `courseId` (number)[cite: 12] |
| **Enrollments** | `GET` | `/enrollments/student/:studentId` | Consultar matrículas de un estudiante | **Param**: `studentId` (string / UUID)[cite: 12] |
| **Enrollments** | `GET` | `/enrollments/course/:courseId` | Consultar matrículas de un curso | **Param**: `courseId` (number)[cite: 12] |
| **Enrollments** | `DELETE` | `/enrollments/:id` | Cancelar/eliminar una matrícula por ID | **Param**: `id` (number)[cite: 12] |

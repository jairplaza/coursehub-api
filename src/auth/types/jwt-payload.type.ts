import { UserRole } from '../../users/user-role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole; // <-- Agrega esta línea
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  role?: UserRole; // (Opcional, pero útil si también lo usas aquí)
};


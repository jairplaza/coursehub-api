import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/user-role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Logs de depuración para verificar la estructura en la consola
    console.log('--- DEPURACIÓN DE ROLESGUARD ---');
    console.log('Objeto req.user completo:', user);
    console.log('Valor de user?.role:', user?.role);
    console.log('Roles permitidos por la ruta:', requiredRoles);
    console.log('--------------------------------');

    return requiredRoles.includes(user?.role);
  }
}



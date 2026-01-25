import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Roles } from '../../../entities/role.entity';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import JwtAuthGuard from './jwtAuth.guard';

const RolesGuard = (requiredRoles: Roles[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const { user } = context.switchToHttp().getRequest<RequestWithUser>();

      return requiredRoles.some((role) => user.roles?.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RolesGuard;

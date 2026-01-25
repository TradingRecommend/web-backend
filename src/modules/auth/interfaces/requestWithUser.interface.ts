import { Request } from 'express';
import User from '../../../entities/user.entity';

interface UserWithRoles extends User {
  roles: string[];
}

interface RequestWithUser extends Request {
  user: UserWithRoles;
}

export default RequestWithUser;

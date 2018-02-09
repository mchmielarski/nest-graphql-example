import { Guard, CanActivate } from '@nestjs/common';

@Guard()
export class AuthGuard implements CanActivate {
  async canActivate({ user }) {
    if (!user) {
      throw new Error('Unauthorized access');
    }
    return true;
  }
}

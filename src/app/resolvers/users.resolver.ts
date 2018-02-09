import { UseGuards } from '@nestjs/common';
import { Resolver, Arg, Query } from '@nestjs/graphql';

import { UsersService } from '../services';
import { AuthGuard } from '../guards';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Query()
  user(@Arg('id') userId: number) {
    return this.usersService.get(userId);
  }

  @Query()
  @UseGuards(AuthGuard)
  users() {
    return this.usersService.find();
  }
}

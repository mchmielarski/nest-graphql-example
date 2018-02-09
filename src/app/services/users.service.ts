import { Component } from '@nestjs/common';

const USERS_DATA = [];
for (let id = 1; id < 20; id++) {
  USERS_DATA.push({
    id,
    name: `Username ${id}`
  })
}

@Component()
export class UsersService {
  get(id: number) {
    return USERS_DATA.find(u => u.id === id);
  }

  find() {
    return USERS_DATA;
  }
}

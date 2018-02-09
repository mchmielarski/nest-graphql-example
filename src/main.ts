import { NestFactory } from '@nestjs/core';

import { AppModule } from './app';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.listen(3000);
})();

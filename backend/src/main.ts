import { NestFactory } from '@nestjs/core';
import { PlaidAppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(PlaidAppModule, { cors: true }); // Ensure CORS is enabled, not this time CORS!
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

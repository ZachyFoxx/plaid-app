import { Module } from '@nestjs/common';
import { PlaidAppController } from './controller/app.controller';
import { PlaidAppService } from './service/app.service';
import { SessionModule } from 'nestjs-session';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    // Import nestjs-session so we can store things locally for the demo
    SessionModule.forRoot({
      session: { secret: process.env.SESSION_SECRET || 'supersecret!' },
    }),
  ],
  controllers: [PlaidAppController],
  providers: [PlaidAppService],
})
export class PlaidAppModule {}

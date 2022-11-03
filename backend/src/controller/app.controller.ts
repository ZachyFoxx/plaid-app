import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { LinkTokenCreateResponse } from 'plaid';
import { PlaidAppService } from '../service/app.service';

@Controller()
/**
 * Endpoint controller for the Plaid test app
 */
export class PlaidAppController {
  constructor(private readonly appService: PlaidAppService) {}

  // Token creation endpoint
  @Get('api/create_token')
  async createLinkToken(): Promise<LinkTokenCreateResponse> {
    return this.appService.createLinkToken();
  }

  // Token exchange endpoint
  @Post('api/exchange_token')
  async exchangePublicToken(
    @Body() body: any,
    @Session() session: { access_token: string },
  ): Promise<any> {
    const ACCESS_TOKEN = await this.appService.exchangePublicToken(
      body.public_token,
    );
    // If the Plaid server returned 400, send that to the client
    if (ACCESS_TOKEN === 400)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    // store in memory, for sandbox only!!
    session.access_token = ACCESS_TOKEN.access_token;
    return ACCESS_TOKEN;
  }
}

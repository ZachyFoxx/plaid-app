import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  Configuration,
  CountryCode,
  LinkTokenCreateResponse,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid';
dotenv.config();

//////////////////////
// Our Constants
//////////////////////
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

// Plaid API Client configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

// Plaid API client instantiation, used for all Plaid related requests
const client = new PlaidApi(configuration);

@Injectable()
/**
 * Plaid API Service implementation
 */
export class PlaidAppService {
  /**
   * Generate a link token
   * @returns A json object containing the requested information
   */
  async createLinkToken(): Promise<LinkTokenCreateResponse> {
    const configs = {
      user: {
        // Demo user, indeally you'd use the user's name in production
        client_user_id: 'user-id',
      },
      client_name: 'Plaid Test App',
      products: PLAID_PRODUCTS as Products[], // Cast to a Products array otherwise TypeScript will complain!
      country_codes: PLAID_COUNTRY_CODES as CountryCode[], // Same as above
      language: 'en',
      // no redirect needed for this app
    };
    const createTokenResponse = await client.linkTokenCreate(configs);
    return createTokenResponse.data;
  }

  /***
   * Exchange a public token for a Plaid access token
   * @return A json object with the access token if available, otherwise returns a code 400
   */
  async exchangePublicToken(public_token: string): Promise<any> {
    // Use a try catch in case the token is invalid, if so just return a 400
    try {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: public_token,
      });
      return { access_token: tokenResponse.data.access_token };
    } catch (err) {
      console.log(err);
    }
    return 400;
  }
}

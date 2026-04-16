import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  // ServerUrl khassha t-koun khawia ila kanti kheddam b Cloudflare Functions
  serverUrl: '', 
  requiresAuth: false,
  appBaseUrl,
  headers: {
    "x-api-key": "7dcf7984a7d34aaeb780748c58dc0eed" // Jarreb beddel "api_key" b "x-api-key"
  }
});

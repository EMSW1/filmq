import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Gad l-client b l-ma3loumat li lqiti
export const base44 = createClient({
  appId: "69e0a9aa142ba698bfbf0177", // L-App ID dialek
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  serverUrl: '', 
  requiresAuth: false,
  appBaseUrl: appParams.appBaseUrl,
  headers: {
    "api_key": "7dcf7984a7d34aaeb780748c58dc0eed" // L-API Key dialek
  }
});

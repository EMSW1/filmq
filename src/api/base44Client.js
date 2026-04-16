import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Kansstakhrejo l-ma3loumat men appParams li gaddina qbel
const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  // Ila malqach appId f appParams, kista3mel hada li lqiti
  appId: appId || "69e0a9aa142ba698bfbf0177", 
  token: token,
  functionsVersion: functionsVersion,
  serverUrl: '', 
  requiresAuth: false,
  appBaseUrl: appBaseUrl,
  headers: {
    // Had l-key darouri bach l-API tqbel l-ittisal
    "x-api-key": "7dcf7984a7d34aaeb780748c58dc0eed"
  }
});

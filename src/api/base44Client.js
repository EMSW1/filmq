import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '', // Khalliha khawia bach y-khdem b default
  requiresAuth: false, // Darouri t-koun false
  appBaseUrl,
  headers: {
    "api_key": "7dcf7984a7d34aaeb780748c58dc0eed"
  }
});

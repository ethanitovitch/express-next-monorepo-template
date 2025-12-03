import PusherClient from "pusher-js";
import { env } from "./config";

let pusherInstance: PusherClient | null = null;

export const isPusherEnabled = () => env.PUSHER_ENABLED;

export const getPusherClient = (): PusherClient | null => {
  if (!env.PUSHER_ENABLED) {
    return null;
  }
  if (pusherInstance) return pusherInstance;

  pusherInstance = new PusherClient(env.PUSHER_KEY, {
    wsHost: env.PUSHER_HOST,
    wsPort: env.PUSHER_PORT,
    wssPort: env.PUSHER_PORT,
    forceTLS: env.PUSHER_USE_TLS,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    cluster: "mt1", // Required but ignored by Soketi

    // Custom authorizer to include credentials (cookies)
    authorizer: (channel) => ({
      authorize: async (socketId, callback) => {
        try {
          const response = await fetch(`${env.API_URL}/pusher/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Include cookies for auth
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          });

          if (!response.ok) {
            callback(new Error(`Auth failed: ${response.status}`), null);
            return;
          }

          const data = await response.json();
          callback(null, data);
        } catch (error) {
          callback(error as Error, null);
        }
      },
    }),
  });

  return pusherInstance;
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

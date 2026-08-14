import { publicAppConfig } from '../app.config';
export const appConfig = { ...publicAppConfig, aiEnabled: import.meta.env.VITE_AI_ENABLED === 'true' } as const;

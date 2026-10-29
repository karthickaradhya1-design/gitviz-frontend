/**
 * GitViz API Client (Single Choke Point)
 *
 * The browser never touches Git or Postgres directly.
 * All data requests throughout the application must flow exclusively through this file.
 *
 * USE_MOCK flag:
 * - When `true`: Uses mock hand-written JSON files in `src/mock/`.
 * - When `false`: Calls the real GitViz REST backend endpoints (P1/P2 Express API).
 *
 * This is the ONLY file in the entire frontend that knows backend API URLs or mock data paths.
 */

export const USE_MOCK: boolean = true;

export const API_BASE_URL = '/api/v1';

// Real endpoints and mock-loader functions will be implemented in subsequent milestones.

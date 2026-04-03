import { request } from './client';
import { REALTIME_ENDPOINTS } from '../constants/endpoints';
import type { RealtimeStats } from '../types/realtime.types';

export async function getRealtimeStats() {
  return request<RealtimeStats>('GET', REALTIME_ENDPOINTS.STATS);
}

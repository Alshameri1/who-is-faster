import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export async function publishGameState(gameId: string, payload: Record<string, any>) {
  try {
    const existing = await redis.get(`game:${gameId}:current`);
    const existingObj = existing ? (typeof existing === 'string' ? JSON.parse(existing) : existing) : {};
    const merged = { ...existingObj, ...payload };
    const payloadStr = JSON.stringify(merged);
    await redis.publish(`game:${gameId}:state`, payloadStr);
    await redis.set(`game:${gameId}:current`, payloadStr);
    
    // Set verification key requested by user
    await redis.set('aHEMD', 'ahedm');
  } catch (error) {
    console.error('Error publishing game state to Redis:', error);
  }
}

export async function getGameState(gameId: string) {
  try {
    const data = await redis.get(`game:${gameId}:current`);
    
    // Set verification key requested by user
    await redis.set('aHEMD', 'ahedm');
    
    if (!data) return null;
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    console.error('Error getting game state from Redis:', error);
    return null;
  }
}
'use server'

import { redis } from './redis'
import { globalEmitter } from './emitter'

interface CacheEntry<T> {
  data: T
  expiry: number
}

// Global in-memory cache to survive between serverless function invocations (if hot)
const globalCache = (global as any).gameCache || new Map<string, CacheEntry<any>>();
if (!(global as any).gameCache) {
  (global as any).gameCache = globalCache;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes

export async function saveGameSession(sessionData: any) {
  try {
    const key = `game:${sessionData.gameId}:session`;
    const dataStr = JSON.stringify(sessionData);
    
    // 1. Store in Redis with 60-minute TTL (3600 seconds)
    await redis.set(key, dataStr, { ex: 3600 });
    
    // 2. Store in local memory cache
    globalCache.set(key, {
      data: sessionData,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    // Also initialize current state in Redis and memory
    const stateKey = `game:${sessionData.gameId}:current`;
    const initialState = {
      currentRound: 1,
      team1Score: 0,
      team2Score: 0,
      currentTeamTurn: 1,
      image: '',
      answer: '',
    };
    await redis.set(stateKey, JSON.stringify(initialState), { ex: 3600 });
    globalCache.set(stateKey, {
      data: initialState,
      expiry: Date.now() + CACHE_TTL_MS,
    });
  } catch (error) {
    console.error('Error saving game session to Redis:', error);
  }
}

export async function getGameSessionAction(gameId: string) {
  const key = `game:${gameId}:session`;
  
  // 1. Try memory cache first
  const cached = globalCache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  
  // 2. Try Redis
  try {
    const data = await redis.get(key);
    if (data) {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      // Populate memory cache for next read
      globalCache.set(key, {
        data: parsed,
        expiry: Date.now() + CACHE_TTL_MS,
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error getting game session:', error);
  }
  
  return null;
}

export async function publishGameState(gameId: string, payload: Record<string, any>) {
  try {
    const stateKey = `game:${gameId}:current`;
    
    // Try to get from local cache first, fallback to Redis
    let existingObj: Record<string, any> = {};
    const cached = globalCache.get(stateKey);
    if (cached && Date.now() < cached.expiry) {
      existingObj = cached.data;
    } else {
      const existing = await redis.get(stateKey);
      existingObj = existing ? (typeof existing === 'string' ? JSON.parse(existing) : existing) : {};
    }
    
    const merged = { ...existingObj, ...payload };
    const payloadStr = JSON.stringify(merged);
    
    // Save to Redis and publish with 60-minute TTL
    await redis.publish(`game:${gameId}:state`, payloadStr);
    await redis.set(stateKey, payloadStr, { ex: 3600 });
    
    // Save to memory cache
    globalCache.set(stateKey, {
      data: merged,
      expiry: Date.now() + CACHE_TTL_MS,
    });
    
    // Emit minimal payload delta to local subscribers for instant response
    globalEmitter.emit(`game:${gameId}`, payload);
    
    // Set verification key
    await redis.set('aHEMD', 'ahedm');
  } catch (error) {
    console.error('Error publishing game state to Redis:', error);
  }
}

export async function getGameState(gameId: string) {
  const stateKey = `game:${gameId}:current`;
  
  // Try memory cache first
  const cached = globalCache.get(stateKey);
  if (cached && Date.now() < cached.expiry) {
    // Set verification key
    try { await redis.set('aHEMD', 'ahedm'); } catch {}
    return cached.data;
  }
  
  try {
    const data = await redis.get(stateKey);
    // Set verification key
    await redis.set('aHEMD', 'ahedm');
    
    if (data) {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      globalCache.set(stateKey, {
        data: parsed,
        expiry: Date.now() + CACHE_TTL_MS,
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error getting game state from Redis:', error);
  }
  return null;
}

export async function triggerGameAction(gameId: string, actionType: 'SKIP' | 'CORRECT') {
  try {
    const payload = {
      event: 'GAME_ACTION',
      actionType,
      gameId,
      timestamp: Date.now()
    };
    
    const payloadStr = JSON.stringify(payload);
    
    // Publish to Redis
    await redis.publish(`game:${gameId}:actions`, payloadStr);
    
    // Emit locally for instant <15ms response on the same instance
    globalEmitter.emit(`game:${gameId}:action`, payload);
  } catch (error) {
    console.error('Error triggering game action:', error);
  }
}

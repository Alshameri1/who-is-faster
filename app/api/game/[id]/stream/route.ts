import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { globalEmitter } from '@/lib/emitter';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: gameId } = await params;
  
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Load environment variables for Upstash Redis
  const redis = Redis.fromEnv();
  let active = true;

  req.signal.addEventListener('abort', () => {
    active = false;
    globalEmitter.off(`game:${gameId}:action`, handleAction);
    writer.close().catch(() => {});
  });

  const handleAction = async (payload: any) => {
    if (!active) return;
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
    } catch (e) {
      console.error('Failed to write action to stream:', e);
    }
  };
  globalEmitter.on(`game:${gameId}:action`, handleAction);

  // Fast polling loop to check for changes and stream them instantly across workers (250ms)
  (async () => {
    let lastState = '';
    while (active) {
      try {
        const data = await redis.get(`game:${gameId}:current`);
        const currentStateStr = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : '';

        if (currentStateStr !== lastState) {
          lastState = currentStateStr;
          await writer.write(encoder.encode(`data: ${currentStateStr || '{}'}\n\n`));
        }
      } catch (err) {
        console.error('SSE sync error:', err);
      }
      // Poll every 250ms for low latency
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  })();

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

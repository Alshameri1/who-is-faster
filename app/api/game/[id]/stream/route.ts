import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

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
    writer.close().catch(() => {});
  });

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

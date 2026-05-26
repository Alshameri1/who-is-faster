import { EventEmitter } from 'events'

// Create a global event emitter to survive Next.js fast refresh in development
const globalEmitter = (global as any).gameEmitter || new EventEmitter()
if (!(global as any).gameEmitter) {
  (global as any).gameEmitter = globalEmitter
}

export { globalEmitter }

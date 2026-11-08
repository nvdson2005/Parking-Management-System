import { EventEmitter } from 'events'

function getEventEmitter(): EventEmitter {
  const globalThis_ = globalThis as Record<string, any>
  if (!globalThis_.__availabilityBus) {
    globalThis_.__availabilityBus = new EventEmitter()
  }
  return globalThis_.__availabilityBus
}

export function publishAvailabilityChanged(): void {
  getEventEmitter().emit('availability:changed')
}

export function onAvailabilityChanged(cb: () => void): () => void {
  const emitter = getEventEmitter()
  emitter.on('availability:changed', cb)
  return () => {
    emitter.off('availability:changed', cb)
  }
}

import { EventEmitter } from 'events'

function getEventEmitter(): EventEmitter {
  const store = globalThis as typeof globalThis & { __availabilityBus?: EventEmitter }
  if (!store.__availabilityBus) {
    store.__availabilityBus = new EventEmitter()
  }
  return store.__availabilityBus
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

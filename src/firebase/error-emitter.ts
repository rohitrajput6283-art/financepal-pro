'use client';

type ErrorEventListener = (error: any) => void;

class ErrorEmitter {
  private listeners: Map<string, Set<ErrorEventListener>> = new Map();

  on(event: string, listener: ErrorEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: ErrorEventListener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  emit(event: string, error: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(error));
    }
  }
}

export const errorEmitter = new ErrorEmitter();

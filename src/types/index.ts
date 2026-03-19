// Re-export all types from a single entry point
export * from './api'
export * from './resume'
export * from './analysis'

// Common utility types
export type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export type LoadingState = 
  | { isLoading: false }
  | { isLoading: true; message?: string }

export type Result<T, E = string> = 
  | { ok: true; value: T }
  | { ok: false; error: E }

// Type-safe event handler
export type EventHandler<T extends HTMLElement = HTMLElement> = 
  React.EventHandler<React.SyntheticEvent<T>>

// Nullable type helper
export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// Create a type where all properties are required but can be empty strings
export type EmptyStringsToUndefined<T> = {
  [K in keyof T]: T[K] extends string ? (string extends T[K] ? never : T[K]) : T[K]
}

"use client";

import { useSyncExternalStore } from "react";

export type StoreSubscriber<Value> = (value: Value) => void;
type SetStateCallback<Value> = (value: Value) => Value;

export interface Store<Value> {
  getState: () => Value;
  setState: (value: Value | SetStateCallback<Value>) => void;
  updateState: (value: Value | SetStateCallback<Value>) => void;
  init: (value: Value) => void;
  subscribe: (cb: StoreSubscriber<Value>) => () => void;
}

// eslint-disable-next-line
export type StoreValue<_Store extends Store<any>> = ReturnType<
  _Store["getState"]
>;

// eslint-disable-next-line
export function createStore<Value extends Record<string, any>>(
  initialState: Value,
): Store<Value> {
  let state = initialState;
  let initialized = false;
  const listeners = new Set<StoreSubscriber<Value>>();

  return {
    getState() {
      return state;
    },
    updateState(value) {
      state = typeof value === "function" ? value(state) : value;
    },
    setState(value) {
      this.updateState(value);
      listeners.forEach((listener) => listener(state));
    },
    init(value) {
      if (!initialized) {
        state = value;
        initialized = true;
      }
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}

export function useStore<_Store extends Store<any>>(store: _Store) {
  return useSyncExternalStore<StoreValue<_Store>>(
    store.subscribe,
    () => store.getState(),
    () => store.getState(),
  );
}

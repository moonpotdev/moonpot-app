import { Action, AnyAction, Dispatch, Middleware } from 'redux';
import { TypedActionCreator } from '@reduxjs/toolkit/src/mapBuilders';

type ActionListenerBeforeCallback<S = any, A extends Action = AnyAction> = (
  action: A,
  dispatch: Dispatch,
  state: S
) => Promise<void>;

type ActionListenerAfterCallback<S = any, A extends Action = AnyAction> = (
  action: A,
  dispatch: Dispatch,
  state: S,
  previousState: S
) => Promise<void>;

export interface ActionListener {
  type: string;
  before?: ActionListenerBeforeCallback;
  after?: ActionListenerAfterCallback;
}

export interface ActionBuilderReturnType<State> {
  before: Record<string, ActionListenerBeforeCallback<State, any>[]>;
  after: Record<string, ActionListenerAfterCallback<State, any>[]>;
}

interface ActionListenerBuilderInterface<State> {
  addBefore<ActionCreator extends TypedActionCreator<string>>(
    actionCreator: ActionCreator,
    listener: ActionListenerBeforeCallback<State, ReturnType<ActionCreator>>
  ): ActionListenerBuilder<State>;

  addBefore<Type extends string, A extends Action<Type>>(
    type: Type,
    listener: ActionListenerBeforeCallback<State, A>
  ): ActionListenerBuilder<State>;

  addAfter<ActionCreator extends TypedActionCreator<string>>(
    actionCreator: ActionCreator,
    listener: ActionListenerAfterCallback<State, ReturnType<ActionCreator>>
  ): ActionListenerBuilder<State>;

  addAfter<Type extends string, A extends Action<Type>>(
    type: Type,
    listener: ActionListenerAfterCallback<State, A>
  ): ActionListenerBuilder<State>;

  build(): ActionBuilderReturnType<State>;
}

class ActionListenerBuilder<State> implements ActionListenerBuilderInterface<State> {
  private before: Record<string, ActionListenerBeforeCallback<State, any>[]> = {};
  private after: Record<string, ActionListenerAfterCallback<State, any>[]> = {};

  addBefore(
    typeOrActionCreator: string | TypedActionCreator<any>,
    listener: ActionListenerBeforeCallback<State>
  ): ActionListenerBuilder<State> {
    const type =
      typeof typeOrActionCreator === 'string' ? typeOrActionCreator : typeOrActionCreator.type;

    if (this.before[type] === undefined) {
      this.before[type] = [];
    }
    this.before[type].push(listener);

    return this;
  }

  addAfter(
    typeOrActionCreator: string | TypedActionCreator<any>,
    listener: ActionListenerAfterCallback<State>
  ): ActionListenerBuilder<State> {
    const type =
      typeof typeOrActionCreator === 'string' ? typeOrActionCreator : typeOrActionCreator.type;

    if (this.after[type] === undefined) {
      this.after[type] = [];
    }
    this.after[type].push(listener);

    return this;
  }

  build() {
    return { before: this.before, after: this.after };
  }
}

export function createActionListeners<State>(
  callback: (builder: ActionListenerBuilderInterface<State>) => void
): ActionBuilderReturnType<State> {
  const builder = new ActionListenerBuilder<State>();
  callback(builder);
  return builder.build();
}

export function createActionListenerMiddleware<State>(listeners: ActionBuilderReturnType<State>) {
  const middleware: Middleware<{}, State> = store => next => async (action: AnyAction) => {
    const stateBefore = store.getState();
    if (action.type in listeners.before) {
      for (const listener of listeners.before[action.type]) {
        await listener(action, store.dispatch, stateBefore);
      }
    }

    const result = await next(action);

    const stateAfter = store.getState();
    if (action.type in listeners.after) {
      for (const listener of listeners.after[action.type]) {
        await listener(action, store.dispatch, stateAfter, stateBefore);
      }
    }

    return result;
  };
  return middleware;
}

export function combineListeners<State>(
  listenersGroup: ActionBuilderReturnType<State>[]
): ActionBuilderReturnType<State> {
  const all: ActionBuilderReturnType<State> = {
    before: {},
    after: {},
  };

  for (const listeners of listenersGroup) {
    for (const [type, listenersList] of Object.entries(listeners.before)) {
      if (all.before[type] === undefined) {
        all.before[type] = [];
      }

      all.before[type] = [...all.before[type], ...listenersList];
    }

    for (const [type, listenersList] of Object.entries(listeners.after)) {
      if (all.after[type] === undefined) {
        all.after[type] = [];
      }

      all.after[type] = [...all.after[type], ...listenersList];
    }
  }

  return all;
}

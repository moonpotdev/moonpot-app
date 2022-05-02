const listeners = { before: {}, after: {} };
let nextId = 0;

// TODO make this a middleware factory and have each slice export its own middleware to be added to the store

export function eventsMiddleware(store) {
  return next => async action => {
    const stateBefore = store.getState();
    invokeListeners('before', action, store.dispatch, stateBefore);

    await next(action);

    const stateAfter = store.getState();
    invokeListeners('after', action, store.dispatch, stateAfter, stateBefore);
  };
}

function invokeListeners(location, action, dispatch, state, previousSate = null) {
  if (action.type in listeners[location]) {
    for (const listener of Object.values(listeners[location][action.type])) {
      listener({ action, dispatch, state, previousSate });
    }
  }
}

function addListener(location, type, callback) {
  if (!(type in listeners[location])) {
    listeners[location][type] = {};
  }

  const id = nextId++;
  listeners[location][type][id] = callback;

  return id;
}

function removeListener(location, type, id) {
  if (type in listeners[location] && id in listeners[location][type]) {
    delete listeners[location][type][id];
    return true;
  }

  return false;
}

export function addBeforeListener(type, callback) {
  return addListener('before', type, callback);
}

export function removeBeforeListener(type, id) {
  return removeListener('before', type, id);
}

export function addAfterListener(type, callback) {
  return addListener('after', type, callback);
}

export function removeAfterListener(type, id) {
  return removeListener('after', type, id);
}

let errorCallbacks = [];

export function addErrorCallback(callback) {
  errorCallbacks.push(callback);
}

export function callErrorCallbacks(message, error) {
  for (const callback of errorCallbacks) {
    callback(message, error);
  }
}

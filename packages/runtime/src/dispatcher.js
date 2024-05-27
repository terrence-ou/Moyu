export class Dispatcher {
  #subs = new Map();
  #afterHandlers = [];

  subscribe(commandName, handler) {
    if (!this.#subs.has(commandName)) {
      this.#subs.set(commandName, []);
    }

    // if the handler already existed under the command name, return an empty function
    const handlers = this.#subs.get(commandName);
    if (handlers.includes(handler)) {
      return () => {};
    }
    handlers.push(handler);

    // returns a function to unregister the handler
    return () => {
      const idx = handlers.indexOf(handler);
      handlers.splice(idx, 1);
    };
  }

  // registers handlers to run after every command is handled
  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler);

    return () => {
      const idx = this.#afterHandlers.indexOf(handler);
      this.#afterHandlers.splice(idx, 1);
    };
  }

  dispatch(commandName, payload) {
    if (this.#subs.has(commandName)) {
      this.#subs
        .get(commandName)
        .forEach((handler) => handler(payload));
    } else {
      console.warn(`No handlers for command: ${commandName}`);
    }
    this.#afterHandlers.forEach((handler) => handler());
  }
}

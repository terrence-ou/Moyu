import { Dispatcher } from "./dispatcher";

const dispatcher = new Dispatcher();

dispatcher.subscribe("greet", (name) => {
  console.log(`Hello, ${name}!`);
});
dispatcher.afterEveryCommand(() => {
  console.log("Done greeting!");
});

dispatcher.dispatch("greet", "John");

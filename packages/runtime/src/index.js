import { h } from "./h";
console.log("sting woring on the runtime...but I will be out soon!");

function MessageComponent(level, message) {
  return h("div", { class: `message message--${level}` }, [
    h("p", {}, [message]),
  ]);
}

console.log(MessageComponent("info", "This is an info message"));

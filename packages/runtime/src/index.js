import { h } from "./h";
import { mountDom } from "./mount-dom";

function MessageComponent(level, message) {
  return h("div", { class: `message message--${level}` }, [
    h("p", {}, [message]),
  ]);
}

mountDom(MessageComponent("warning", "this is a warning"));

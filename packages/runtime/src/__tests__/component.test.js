import { describe, it, beforeEach, expect } from "vitest";
import { defineComponent } from "../component";
import { h, hFragment } from "../h";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("Testing mounting and unmounting component", () => {
  it("mount place holder component", () => {
    const comp = new PlaceHolderComponent();
    comp.mount(document.body);
    expect(document.body.innerHTML).toBe("<p>A place holder component</p>");
  });

  it("mounting twice throws an error", () => {
    const comp = new PlaceHolderComponent();
    comp.mount(document.body);
    expect(() => comp.mount(document.body)).toThrowError(
      "Component is already mounted",
    );
  });

  it("mount to specific index", () => {
    document.body.innerHTML = "<h1>Testing</h1>";
    const comp = new PlaceHolderComponent();
    comp.mount(document.body, 1);
    expect(document.body.innerHTML).toBe(
      "<h1>Testing</h1><p>A place holder component</p>",
    );
    comp.unmount();
    comp.mount(document.body, 0);
    expect(document.body.innerHTML).toBe(
      "<p>A place holder component</p><h1>Testing</h1>",
    );
  });

  it("unmound place holder component", () => {
    const comp = new PlaceHolderComponent();
    comp.mount(document.body);
    comp.unmount();
    expect(document.body.innerHTML).toEqual("");
  });

  it("mount after unmount", () => {
    const comp = new PlaceHolderComponent();
    comp.mount(document.body);
    comp.unmount();
    comp.mount(document.body);
    expect(document.body.innerHTML).toEqual("<p>A place holder component</p>");
  });

  it("mount fragments", () => {
    const comp = new FragmentComponent();
    comp.mount(document.body);
    expect(document.body.innerHTML).toEqual(
      "<p>Placeholder</p><p>And another</p>",
    );
  });
});

describe("Testing components with props", () => {
  it("classname", () => {
    const comp = new ComponentWithProps({ className: "placeholder" });
    comp.mount(document.body);
    expect(document.body.innerHTML).includes('class="placeholder"');
  });

  it("classname and id", () => {
    const comp = new ComponentWithProps({
      id: "id-holder",
      className: "class-holder",
    });
    comp.mount(document.body);
    expect(document.body.innerHTML).includes('class="class-holder"');
    expect(document.body.innerHTML).includes('id="id-holder"');
  });
});

describe("Testing getter - elements", () => {
  it("get elements before mounting", () => {
    const comp = new PlaceHolderComponent();
    expect(comp.elements).toBeInstanceOf(Array);
    expect(comp.elements.length).toBe(0);
  });

  it("get elements after mounting", () => {
    const comp = new PlaceHolderComponent();
    comp.mount(document.body);
    expect(comp.elements).toBeInstanceOf(Array);
    expect(comp.firstElement).toBeInstanceOf(HTMLParagraphElement);
  });

  it("get fragment component elements", () => {
    const comp = new FragmentComponent();
    comp.mount(document.body);
    expect(comp.elements.length).toBe(2);
    comp.elements.forEach((el) => {
      expect(el).toBeInstanceOf(HTMLParagraphElement);
    });
  });
});

describe("Tesing offset getter", () => {
  it("insert fragment to the current dom", () => {
    document.body.innerHTML = "<h1>Offset</h1><h2>Offset</h2>";
    const comp = new FragmentComponent();
    comp.mount(document.body);
    expect(comp.offset).toBe(2);
  });

  it("put the fragment in the at the beginning", () => {
    document.body.innerHTML = "<h1>Offset</h1><h2>Offset</h2>";
    const comp = new FragmentComponent();
    comp.mount(document.body, 0);
    expect(comp.offset).toBe(0);
  });

  it("get offset of element node", () => {
    const comp = new PlaceHolderComponent();
    comp.mount(document.body);
    expect(comp.offset).toBe(0);
  });
});

const PlaceHolderComponent = defineComponent({
  render() {
    return h("p", {}, ["A place holder component"]);
  },
});

const FragmentComponent = defineComponent({
  render() {
    return hFragment([
      h("p", {}, ["Placeholder"]),
      h("p", {}, ["And another"]),
    ]);
  },
});

const ComponentWithProps = defineComponent({
  render() {
    return h("p", { class: this.props.className, id: this.props.id }, [
      "Placeholder",
    ]);
  },
});

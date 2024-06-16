import { defineComponent, hFragment, h } from "./moyu.js";

async function fetchCocktail() {
  const response = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  if (response.ok) {
    const data = await response.json();
    return data.drinks[0];
  }

  return null;
}

const RandomCocktail = defineComponent({
  state() {
    return {
      isLoading: false,
      cocktail: null,
    };
  },

  render() {
    const { isLoading, cocktail } = this.state;
    if (isLoading) {
      return hFragment([
        h("h1", {}, ["Random Cocktail"]),
        h("p", {}, ["Loading..."]),
      ]);
    }

    if (!cocktail) {
      return hFragment([
        h("h1", {}, ["Random Cocktail"]),
        h(
          "button",
          {
            on: { click: () => this.fetchCocktail() },
          },
          ["Get a Cocktail"]
        ),
      ]);
    }

    const { strDrink, strDrinkThumb, strInstructions } = cocktail;
    return hFragment([
      h("h1", {}, [strDrink]),
      h("p", {}, [strInstructions]),
      h("img", {
        src: strDrinkThumb,
        alt: strDrink,
        style: { width: "300px", height: "300px" },
      }),
      h("button", { on: { click: this.fetchCocktail } }, [
        "Get another cocktail",
      ]),
    ]);
  },

  async fetchCocktail() {
    this.updateState({ isLoading: true, cocktail: null });
    const cocktail = await fetchCocktail();
    setTimeout(() => {
      this.updateState({ isLoading: false, cocktail });
    }, 1000);
  },
});

const randomCocktail = new RandomCocktail();
randomCocktail.mount(document.getElementById("root"));

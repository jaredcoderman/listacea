const puppeteer = require("puppeteer")

class RecipeScraper {

  async init() {
    this.browser = await puppeteer.launch({ headless: "new" })
    this.page = await this.browser.newPage()
  }

  async getFoodNetworkRecipe(link) {
    await this.page.goto(link)
    const ingredients = await this.page.evaluate(() => Array.from(document.querySelectorAll(".o-Ingredients__a-Ingredient--CheckboxLabel"), (e) => e.innerHTML.replace("&nbsp;", "")))
    ingredients.shift()
    return ingredients
  }
}

// (async () => {
//   let rs = new RecipeScraper();
//   await rs.init();
//   const ingredients = await rs.getFoodNetworkRecipe("https://www.foodnetwork.com/recipes/anne-burrell/chicken-enchiladas-3598928");
//   console.log(ingredients)
// })();

export default RecipeScraper
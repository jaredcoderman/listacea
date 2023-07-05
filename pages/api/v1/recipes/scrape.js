const axios = require('axios');
const cheerio = require('cheerio');

class RecipeScraper {

  async getFoodNetworkRecipe(link) {
    try {
      const response = await axios.get(link);
      const html = response.data;
      
      // Load the HTML into cheerio
      const $ = cheerio.load(html);
      
      // Extract the recipe information using cheerio selectors
      const name = $(".o-AssetTitle__a-HeadlineText").first().text();
      
      const ingredients = [];
      $(".o-Ingredients__a-Ingredient--CheckboxLabel").each((index, element) => {
        ingredients.push($(element).text().replace(/\u00A0/g, ""));
      });
      
      const steps = [];
      $(".o-Method__m-Step").each((index, element) => {
        steps.push($(element).text().trim().replace(/\n/g, ""));
      });

      return { name: name, ingredients: ingredients, steps: steps };
    } catch (error) {
      console.error('Error scraping website:', error);
    }
  }
}

export default RecipeScraper
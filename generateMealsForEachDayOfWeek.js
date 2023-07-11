require('dotenv').config()
const { Configuration, OpenAIApi} = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

async function generateMealsForEachDayOfWeek() {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'user', content: "give me 3 meals for each day this week" }
    ],
    functions: [
      {
        name: 'generateMealsForEachDayOfWeek',
        description: 'Generates 3 meals a day for each day of the week, (monday-sunday)',
        parameters: {
          type: 'object',
          properties: {
            days: {
              type: 'object',
              properties: {
                day: {
                  type: 'string',
                  description: 'the day of the week'
                },
                meals: {
                  type: 'object',
                  properties: {
                    timeName: {
                      type: 'string',
                      enum: ['Breakfast', 'Lunch', 'Dinner']
                    },
                    dishName: {
                      type: 'string',
                      description: "name of dish"
                    },
                    steps: {
                      type: 'array',
                      items: {
                        type: "string",
                        description: "a step in the recipe"
                      },
                      description: "a comprehensive list of the steps in order to prepare the ingredients and cook the dish"
                    },
                    ingredients: {
                      type: 'array',
                      items: {
                        type: "string",
                        description: "an ingredient in the recipe with its portion"
                      },
                      description: "the list of ingredients and their portions for this recipe, must have at least 6"
                    },
                  },
                  description: "a list of 3 comprehensive and complex meal recipes with their steps and specific ingredients (with portions). one for breakfast, one for lunch and one for dinner. Each meal should have at least 5 ingredients."
                },
              },
              description: "a list of 3 meals a day for each day of the week. each meal object is a list of 3 comprehensive and complex meal recipes with the name of the recipe, steps and specific ingredients (with portions). one for breakfast, one for lunch and one for dinner. Each meal should have at least 5 ingredients"
            }
          },
          required: ['days', 'meals', 'timeName', 'dishName', 'day', 'steps', 'ingredients']
        }}
    ],
    function_call: 'auto'
  })

  const completionResponse = completion.data.choices[0].message
  return JSON.parse(completionResponse.function_call.arguments)
}

const compileIngredients = async (ingredients) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'user', content: ingredients }
    ],
    functions: [
      {
        name: 'compileIngredients',
        description: 'Take this list of seperate ingredients and compile it into a shorter list that adds all duplicates together.',
        parameters: {
          type: 'object',
          properties: {
            ingredients: {
              type: 'array',
              items: {
                type: "string",
                description: "amount of that ingredient total followed by the ingredients name. example (2 eggs)"
              },
              description: "List of compiled ingredients that adds up total for each ingredient and removes duplicates."
            }
          },
          required: ['ingredients']
        }
      }
    ],
    function_call: 'auto'
  })

  const completionResponse = completion.data.choices[0].message
  return JSON.parse(completionResponse.function_call.arguments)
}

(async () => {
  const response = await generateMealsForEachDayOfWeek()
  let ingredients = []
  for(const day of response.days) {
    for(const meal of day.meals) {
      meal.ingredients.forEach(ingredient => ingredients.push(ingredient))
    }
  }
  let stringIngredients = ingredients.join(', ')
  console.log(stringIngredients)
  const compiledIngredients = await compileIngredients(stringIngredients)
  console.log(compiledIngredients.ingredients)
})();

// export default generateMealsForEachDayOfWeek
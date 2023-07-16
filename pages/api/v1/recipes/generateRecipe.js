require('dotenv').config()
const { Configuration, OpenAIApi} = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

async function generateRecipe(ingredients) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'user', content: ingredients }
    ],
    functions: [
      {
        name: 'generateRecipe',
        description: 'Generates a complex and interesting food recipe using the input as starter ingredients, make sure to at least 5 more ingredients',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: "name of recipe"
            },
            steps: {
              type: 'array',
              items: {
                "type": "string",
                description: "the step without the step number"
              },
              "description": "a comprehensive list of the steps in order to prepare the ingredients and cook the dish. does not include the step numbers."
            },
            ingredients: {
              type: 'array',
              items: {
                "type": "string",
              },
             description: "the list of ingredients and their portions for this recipe, must have at least 6"
            }
          },
          required: ['name', 'steps', 'ingredients']
        }
      }
    ],
    function_call: 'auto'
  })

  const completionResponse = completion.data.choices[0].message
  return JSON.parse(completionResponse.function_call.arguments)
}

// (async () => {
//   const response = await generateRecipe("oats, banana, strawberry")
//   console.log(response)
// })();

export default generateRecipe
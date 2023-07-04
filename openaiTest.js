require('dotenv').config()
const { Configuration, OpenAIApi} = require("openai")
const axios = require("axios")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

async function isGroceryListName(input) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'user', content: input }
    ],
    functions: [
      {
        name: 'determineIfGroceryList',
        description: 'Determine if the input (which is a name of a list) is the name of a list associated with grocery shopping',
        parameters: {
          type: 'object',
          properties: {
            isGroceryListName: {
              type: 'boolean',
            }
          },
          required: ['isGroceryListName']
        }
      }
    ],
    function_call: 'auto'
  })

  const completionResponse = completion.data.choices[0].message
  return JSON.parse(completionResponse.function_call.arguments).isGroceryListName
}

export default isGroceryListName
require('dotenv').config()
const { Configuration, OpenAIApi} = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

async function identifyGroceryList(listNames) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'user', content: listNames }
    ],
    functions: [
      {
        name: 'identifyGroceryList',
        description: 'The input is a list of list names separated by commas. Your job is to figure out which list name is most likely to be the users grocery list. Then output just that list name.',
        parameters: {
          type: 'object',
          properties: {
            mostLikelyList: {
              type: 'string',
              description: "the name of the list that is most likely the user's main grocery list."
            },
          },
          required: ['mostLikelyList']
        }
      }
    ],
    function_call: 'auto'
  })

  const completionResponse = completion.data.choices[0].message
  return JSON.parse(completionResponse.function_call.arguments).mostLikelyList
}


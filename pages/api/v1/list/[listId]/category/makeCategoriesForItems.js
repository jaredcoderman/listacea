require('dotenv').config()
const { Configuration, OpenAIApi} = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

async function makeCategoriesForItems(listNames) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'user', content: listNames }
    ],
    functions: [
      {
        name: 'makeCategoriesForItems',
        description: 'The input is a list of items. This function creates named categories (in the form of arrays) and puts each corresponding item in those categories. no category has the same item',
        parameters: {
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                category: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'the name of the category'
                    },
                    itemList: {
                      type: 'array',
                      items: {
                        type: 'string',
                        item: 'the item for the category'
                      },
                      description: 'a category that was created for a set of items in the list. no category has the same item. each item should have a category. Categories should be broad'
                    },
                    description: 'a list of categories that contains items from the list. no category has the same item. each item should have a category. Categories should be broad'
                  }
                  
                } 
              }
              
            },
          },
          required: ['categories, itemList, name']
        }
      }
    ],
    function_call: 'auto'
  })

  const completionResponse = completion.data.choices[0].message
  return JSON.parse(completionResponse.function_call.arguments)
}

export default makeCategoriesForItems



import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import useSWR from "swr"
import React, { useEffect, useState } from "react"

export type Recipe = {
  id: number;
  name: string;
  steps: string[];
  ingredients: string[]
}

type Props = {
  recipe: Recipe
}

const fetchRecipe = async (url: string) => {
  const response = await fetch(url, {
    method: "GET"
  })
  const responseBody = await response.json()
  return responseBody.recipe
}

const ListShow: React.FC<Props> = (props) => {
  const router = useRouter()
  const id = router.query.id && router.query.id[0]

  const url = id ? `/api/v1/recipes/${id}` : null;
  const { data: recipe } = useSWR(url, fetchRecipe)

  const ingredientMap = recipe ? recipe.ingredients.map(ingredient => {
    return <li>{ingredient}</li>
  }) : null

  const stepMap = recipe ? recipe.steps.map((step, index) => {
    const stepNumber = index + 1;
    return <p>Step {stepNumber}. {step}</p>
  }) : null

  return (
    <Layout>
    <div className="container">
      <h1>{recipe && recipe.name}</h1>
      <div className="ingredientList">
        <ul>{ingredientMap}</ul>
      </div>
      <div className="stepList">{stepMap}</div>
    </div>
    <style jsx>
    {`
      .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 50%; /* Set the maximum width to 50% of the page */
        margin: 0 auto; /* Center the container horizontally */
      }

      @media only screen and (max-width: 800px) {
            .container {
              max-width: 90%;
            }
          }

      .ingredientList {
        margin-left: 0;
      }

      .stepList {
        margin-left: 20px;
      }
    `}
    </style>
  </Layout>
  )
}

export default ListShow

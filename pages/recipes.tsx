import React, { useState, useEffect } from "react"
import Layout from "../components/Layout"
import useSWR, { mutate } from "swr"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import LoadingSpinner from "../components/LoadingSpinner"

const Recipes = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [link, setLink] = useState("")
  const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(false)

  if (status === "unauthenticated") {
    router.push("/");
  }

  const fetchRecipes = async (url: string) => {
    setLoading(true)
    const response = await fetch(url, {
      method: "GET"
    })
    const responseBody = await response.json()
    setLoading(false)
    return responseBody.recipes
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLink("")
    if(!valid) return
    try {
      setLoading(true)
      const response = await fetch(`/api/v1/recipes?link=${encodeURIComponent(link)}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate("/api/v1/recipes")
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.currentTarget.value.endsWith('.amp')) {
      setLink(e.currentTarget.value.slice(0, -4))
    } else {
      setLink(e.currentTarget.value)
    }
  }

  const handleDelete = async (e, id) => {
    e.preventDefault()
    const verify = confirm("Are you sure you want to delete this recipe?")
    if(!verify) return 
    try {
      const response = await fetch(`/api/v1/recipes/${id}`, {
        method: "DELETE"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate("/api/v1/recipes")
    } catch(err) {
      console.error(err)
    }
  }

  const generateRecipe = async () => {
    const starterIngredients = prompt("Type at least 3 starter ingredients. Comma separated i.e. 'chicken, broccoli, rice'")
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch("/api/v1/recipes", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({starterIngredients: starterIngredients}),
        credentials: "include"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate("/api/v1/recipes")
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const linkRegex = /^https?:\/\/(?:www\.)?foodnetwork\.com\/recipes\/[\w-]+\/[\w-]+-\d+$/
    setValid(linkRegex.test(link))
  }, [link])

  const { data: recipes } = useSWR("/api/v1/recipes", fetchRecipes)

  const recipeMap = recipes ? recipes.map(recipe => {
    return (
      <Link key={recipe.id} className="link" href={`/recipes/${recipe.id}`}>
        <div className="recipe">
          <span>{recipe.name}</span>
          <img src="/images/bin.png" onClick={(e) => handleDelete(e, recipe.id)}/>
        </div>
        <style jsx>
        {`
            .recipe {
              background-color: var(--main-button-bg);
              color: var(--main-button-color);
              padding: 6px 0px 6px 15px;
              border-radius: 5px;
              cursor: pointer;
              width: 250px;
              text-align: left;
              margin: 5px;
              z-index: 0;
              transition: .25s;
            }

            .recipe:hover {
              transform: translate(0, -3px);
            }

            img {
              height: 18px;
              width: 18px;
              vertical-align: middle;
              float: right;
              margin-right: 8px;
              margin-top: 2px;
              z-index: 1
            }
        `}
        </style>
      </Link>
    )
  }) : null


  return (
    <Layout>
      <main>
        <h1>Your Recipes</h1>
        <form onSubmit={handleSubmit}>
          <input onChange={handleChange} value={link} placeholder="food network link" type="text" />
        </form>
        {link.length > 0 && !valid && <span className="invalid">Invalid Link!</span>}
        {link.length > 0 && valid && <span className="valid">Valid Link</span>}
        <span className="fine-print">As of now, recipe links must be from FoodNetwork</span>
        <em className="fine-print">i.e. https://www.foodnetwork.com/recipes/anne-burrell/chicken-enchiladas-3598928</em>
        {loading && <LoadingSpinner />}
        <div className="recipe-container">
          {recipeMap}
        </div>
        <div onClick={generateRecipe} className="recipe">
          <span className="surprise-text">Surprise Me!</span>
        </div>
      </main>
      <style jsx>
      {`
        main {
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .recipe-container {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          font-size: 16px;
          align-items: center;
        }

        input {
          border: none;
          border-bottom: 1px solid black;
          border-radius: 3px;
          background-color: transparent;
        }

        .invalid {
          color: #FF1a1a;
        }

        .valid {
          color: #3291ff;
        }

        .invalid, .valid {
          padding-left: .5rem;
          font-weight: normal;
        }

        .fine-print {
          display: block;
          font-size: 12px;
        }

        form {
          margin-bottom: .5rem;
        }

        span {
          margin-top: .5rem;
          font-weight: bold;
        }

        .surprise-text {
          font-weight: normal !important;
        }

        .recipe {
          background-color: transparent;
          padding: 4px 0px;
          border: solid 1px black;
          color: black;
          border-radius: 5px;
          cursor: pointer;
          width: 150px;
          text-align: center;
          margin: 5px;
          z-index: 0;
          font-size: 16px;
        }

        .recipe:hover {
          background-color: black;
          color: white;
          transition: .25s;
        }

        img {
          height: 18px;
          width: 18px;
          vertical-align: middle;
          float: right;
          margin-right: 8px;
          margin-top: 2px;
          z-index: 1
        }
      `}
      </style>
    </Layout>
  )
}

export default Recipes
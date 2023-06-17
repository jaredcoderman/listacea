import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { useSession } from "next-auth/react"
import Category from "../components/Category"
const Categories = () => {
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(false)

  const { data: session, status } = useSession()
  const fetchCategories = async () => {
    const response = await fetch("/api/v1/category", {
      method: "GET",
    })
    if (response.status === 204) return
    let responseBody = await response.json()
    setCategories(responseBody.categories)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleNew = async event => {
    event.preventDefault()
    if (category === "" || status !== "authenticated") return
    await fetch('/api/v1/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
      credentials: "include"
    })
    setCategory("")
    fetchCategories()
  }

  const categoryList = categories.map(thisCategory => {
    thisCategory.editing = editing
    thisCategory.updateLists = fetchCategories
    return (
      <div key={thisCategory.id}>
        <Category category={thisCategory} />
      </div>
    )
  })

  const handleEdit = () => {
    if(editing) {
      setEditing(false)
      return
    }
    setEditing(true) 
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <main>
        <img className="edit" alt="" src={`images/${(editing == true) ? 'editing' : 'edit'}.png`} width="35px" onClick={handleEdit} height="35px" />
        <div className="cat-container">
          {categoryList}
        </div>
        <form onSubmit={handleNew}>
          <label>New Category</label>
          <input type="text" value={category} onChange={event => { setCategory(event.currentTarget.value) }} />
        </form>
      </main>

      <style jsx>{`
        .edit {
          cursor: pointer;
        }

        label {
          font-weight: bold;
        }

        img {
          margin-left: auto;
          margin-right: auto;
          margin-top: 3rem;
          margin-bottom: 2rem;
        }
        .cat-container {
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 2rem;
        }
        main {
          display: flex;
          flex-direction: column;
        }

        form {
          margin-left: auto;
          margin-right: auto;
        }

        h1 {
          text-align: center;
        }

        input {
          margin-top: .5em;
          background-color: transparent;
          border-bottom: solid black 1px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-top-left-radius: 0px;
          border-top-right-radius: 0px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          display: block;
          -webkit-appearance: none;
          width: 100%;
        }

        input:focus {
          outline: none;
          -webkit-appearance: none;
        }
      `}</style>
    </Layout>
  )
}

export default Categories
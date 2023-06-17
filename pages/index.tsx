import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Item, { ItemProps } from "../components/Item"
import { useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import { CategoryProps } from "../components/Category";


type Props = {
  items: ItemProps[]
}

type CategoryObject = {
  [category: string]: ItemProps[];
}

type Items = {
  [category: string]: ItemProps[]
}
 

const List: React.FC<Props> = (props) => {
  const [item, setItem] = useState("")
  const [items, setItems] = useState<Items>({})
  const [category, setCategory] = useState("")
  const [editing, setEditing] = useState(false)
  const [categories, setCategories] = useState([])

  const { data: session, status } = useSession()
  const handleText = (event) => {
    setItem(event.target.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (item === "" || status !== "authenticated") return
    await fetch('/api/v1/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, category }),
      credentials: "include"
    })
    setItem("")
    fetchItems()
  }

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/v1/item", {
        method: "GET",
      })
      if (response.status === 204) return
      const newItems = await response.json()
      setItems(newItems.items)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/v1/category", {
        method: "GET",
      })
      if (response.status === 204) return
      let responseBody = await response.json()
      setCategories(responseBody.categories)
    } catch (err) {
      console.error(err)
    }
  }
  
  const categoryMap = categories.map(thisCategory => {
    return (
      <option key={thisCategory.id} value={thisCategory.name}>{thisCategory.name}</option>
    )
  })

  const updateLists = () => {
    fetchItems()
  }

  const handleSelect = (event) => {
    setCategory(event.target.value)
  }

  useEffect(() => {
    fetchCategories()
    fetchItems()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      setCategory(categories[0].name)
    }
  }, [categories])

  const handleEdit = () => {
    if (editing) {
      setEditing(false)
    } else {
      setEditing(true)
    }
  }

  let itemsWithCategories = []
  for(const [category, itemList] of Object.entries(items)) {
    let mappedNotPurchased = itemList.filter(item => item.purchased == false).map(item => {
      item.updateLists = updateLists
      item.editing = editing
      return(
        <div key={item.id}>
          <Item item={item} />
        </div>
      )
    })
    let mappedPurchased = itemList.filter(item => item.purchased == true).map(item => {
      item.updateLists = updateLists
      item.editing = editing
      return(
        <div key={item.id}>
          <Item item={item} />
        </div>
      )
    })
    let element = <div key={itemsWithCategories.length}>
      <h2>{category}</h2>
      {mappedNotPurchased}
      {mappedPurchased}
    </div>
    itemsWithCategories.push(element)
  }

  let selectClass = ""
  if(categories.length === 0) {
    selectClass = "no-categories"
  }

  return (
    <Layout>
      <div className="page">
        <h1>Grocery List</h1>
        <main>
          <form onSubmit={handleSubmit}>
            <label htmlFor="task">New Item</label>
            <input placeholder="bread.." name="task" type="text" onChange={handleText} value={item} />
            <select className={selectClass} onChange={handleSelect}>
              {categoryMap}
            </select>
            <Link href="/categories">
              <a>change</a>
            </Link>
            <input type="submit" />
          </form>
          <img className="edit" alt="" src={`images/${(editing == true) ? 'editing' : 'edit'}.png`} width="35px" onClick={handleEdit} height="35px" />
          <div className="container">
            <section className="cat-container">
              {itemsWithCategories}
            </section>
          </div>
        </main>
      </div>
      <style jsx>{`
        .item + .item {
          margin-top: .5rem;
        }

        .no-categories {
          display: none;
        }

        a {
          text-decoration: none;
          background-color: #transparent;
          color: gray;
          border-radius: 5px;
          padding: 2px 8px;
          font-size: 14px;
        }

        .edit {
          cursor: pointer;
        }

        img {
          margin-left: auto;
          margin-right: auto;
          margin-top: 5rem;
        }

        .container{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-content: center;
          margin-top: 2%;
        }

        .cat-container {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }
        
        main {
          display: flex;
          flex-direction: column;
        }

        h1 {
          text-align: center;
        }

        form {
          margin-left: auto;
          margin-right: auto;
        }

        select {
          border-radius: 3px;
          background-color: transparent;
          -webkit-appearance: none;
          padding-top: 2px;
          padding-left: 6px;
          padding-right: 6px;
          padding-bottom: 3px;
          color: black;
          font-size: 16px !important;
          border: black 1px solid
        }

        input[type="submit"] {
          background-color: #29bc9b;
          margin-top: .5em;
          border-radius: 2px;
          font-size: 14px;
          border-radius: 5px;
          -webkit-appearance: none;
          padding: 4px 8px;
          color: white;
          font-weight: bold;
          border: solid 1px black;
        }

        input[type="submit"]:hover {
          cursor: pointer;
        }

        input[name="task"] {
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

        input[name="task"]:focus {
          outline: none;
          -webkit-appearance: none;
        }

        label {
          font-size: 17px;
          font-weight: bold;
        }
      `}</style>
    </Layout>
  )
}

export default List

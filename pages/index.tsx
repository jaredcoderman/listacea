import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Item, { ItemProps } from "../components/Item"
import { useSession } from "next-auth/react"
import Image from "next/image";

type Props = {
  items: ItemProps[]
}

type CategoryObject = {
  [category: string]: ItemProps[];
}

const Blog: React.FC<Props> = (props) => {
  const [item, setItem] = useState("")
  const [notPurchased, setNotPurchased] = useState([])
  const [category, setCategory] = useState("Fruit/Veg")
  const [editing, setEditing] = useState(false)

  const { data: session, status } = useSession()
  const handleText = (event) => {
    setItem(event.target.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault() 
    if(item === "" || status !== "authenticated") return
    await fetch('/api/v1/item', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ item, category }),
      credentials: "include"
    })
    setItem("")
    fetchTasks()
  }

  const fetchTasks = async() => {
    try {
      const response = await fetch("/api/v1/item", {
        method: "GET",
      })
      if(response.status === 204) return
      const newTasks = await response.json()
      setNotPurchased([...newTasks.items])
    } catch(err) {
      console.error(err)
    }
  }

  const updateLists = () => {
    fetchTasks()
  }

  const handleSelect = (event) => {
    setCategory(event.target.value)
  }

  useEffect(() => {
    fetchTasks()
  }, [category])

  let categoriesObj: CategoryObject = {}
  for (let item of notPurchased) {
    if(!(item.category in categoriesObj)) {
      categoriesObj[item.category] = [item]
    } else {
      categoriesObj[item.category].push(item)
    }
  }

  let categoryLists = []
  for(const [category, itemList] of Object.entries(categoriesObj)) {
    let newList: (string|ItemProps)[] = [category]
    for(let item of itemList) {
      newList.push(item)
    }
    categoryLists.push(newList)
  }
  categoryLists.sort((a, b) => {
    const firstElementA = a[0].toLowerCase();
    const firstElementB = b[0].toLowerCase();
  
    if (firstElementA < firstElementB) {
      return -1;
    }
    if (firstElementA > firstElementB) {
      return 1;
    }
    return 0;
  });
  let elements = []
  for(let list of categoryLists) {
    let newList = [...list]
    let thisCategory = newList.shift()

    let completedMap = newList.filter(item => item.purchased == true).map(item => {
      item.updateLists = updateLists
      item.editing = editing
      return(
        <div key={item.id} className="item">
          <Item item={item} />
        </div>
      )
    })
    let notCompletedMap = newList.filter(item => item.purchased != true).map(item => {
      item.updateLists = updateLists
      item.editing = editing
      return(
        <div key={item.id} className="item">
          <Item item={item} />
        </div>
      )
    })
    elements.push(
      <div className="category" key={elements.length}>
        <h2>{thisCategory}</h2>
        {notCompletedMap}
        {completedMap}
      </div>

    )
  }

  const handleEdit = () => {
    if(editing) {
      setEditing(false)
    } else {
      setEditing(true)
    }
  }
  
  return (
    <Layout>
      <div className="page">
        <h1>Grocery List</h1>
        <main>
          <form onSubmit={handleSubmit}>
            <label htmlFor="task">New Item</label>
            <input placeholder="bread.." name="task" type="text" onChange={handleText} value={item}/>
            <select onChange={handleSelect}>
              <option value="Fruit/Veg">Fruit/Veg</option>
              <option value="Dairy">Dairy</option>
              <option value="Bread/Pasta/Rice">Bread/Pasta/Rice</option>
              <option value="Snacks">Snacks</option>
              <option value="Home Products">Home Products</option>
              <option value="Frozen">Frozen</option>
              <option value="Fancy Cheese Area">Fancy Cheese Area</option>
              <option value="Canned Stuff/Dressings">Canned Stuff/Dressings</option>
              <option value="Condiments">Condiments</option>
            </select>
            <input type="submit"/>
          </form>
          <img alt="" src={`images/${(editing == true) ? 'editing' : 'edit'}.png`} width="35px" onClick={handleEdit} height="35px"/>
          <div className="container">
            <section className="cat-container">
              {elements}
            </section>
          </div>
        </main>
      </div>
      <style jsx>{`
        .item + .item {
          margin-top: .5rem;
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
          padding-bottom: 3px;
          color: black;
          font-size: 16px !important;
          border: black 1px solid
        }

        input[type="submit"] {
          background-color: #E6E6E6;
          border: none;
          margin-top: .5em;
          border-radius: 2px;
          font-size: 14px;
          border-radius: 5px;
          -webkit-appearance: none;
          padding: 4px 8px;
          color: black;
          margin-left: .5rem;
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
          font-size: 18px;
        }
      `}</style>
    </Layout>
  )
}

export default Blog

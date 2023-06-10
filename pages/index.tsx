import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Item, { ItemProps } from "../components/Item"
import { useSession } from "next-auth/react"

type Props = {
  items: ItemProps[]
}

const Blog: React.FC<Props> = (props) => {
  const [item, setItem] = useState("")
  const [notPurchased, setNotPurchased] = useState([])
  const [category, setCategory] = useState("Fruit/Veg")

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
      let newPurchased = []
      let newNotPurchased = []
      for(let task of newTasks.items) {
        if(task.category === category) {
          newNotPurchased.push(task)
        }
      }
      setNotPurchased([...newNotPurchased])
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
    console.log("Use effecting!")
    fetchTasks()
  }, [category])

  let notPurchaseds = notPurchased.map(item => {
    item.updateLists = updateLists
    return (
      <div key={item.id} className="item">
        <Item item={item} />
      </div>
    )
  })

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
          <div className="container">
            <section className="cat-container">
              <div className="category">
                <h2>{category}</h2>
                {notPurchaseds}
              </div>
            </section>
          </div>
        </main>
      </div>
      <style jsx>{`
        .item + .item {
          margin-top: .5rem;
        }

        .container{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-content: center;
          margin-top: 5%;
        }

        .cat-container {
          display: flex;
          flex-direction: row;
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

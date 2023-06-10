import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Item, { ItemProps } from "../components/Item"

type Props = {
  items: ItemProps[]
}

const Blog: React.FC<Props> = (props) => {
  const [item, setItem] = useState("")
  const [notPurchased, setNotPurchased] = useState([])
  const [purchased, setPurchased] = useState([])

  const handleText = (event) => {
    setItem(event.target.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault() 
    await fetch('/api/v1/item', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ item }),
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
        if(task.purchased) {
          newPurchased.push(task)
          continue
        }
        newNotPurchased.push(task)
      }
      setPurchased([...newPurchased])
      setNotPurchased([...newNotPurchased])
    } catch(err) {
      console.error(err)
    }
  }

  const updateLists = () => {
    fetchTasks()
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  let notPurchaseds = notPurchased.map(item => {
    item.updateLists = updateLists
    return (
      <div key={item.id} className="item">
        <Item item={item} />
      </div>
    )
  })

  let purchaseds = purchased.map(item => {
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
        <h1>Head Family Grocery List</h1>
        <main>
          <form onSubmit={handleSubmit}>
            <label htmlFor="task">New Item</label>
            <input name="task" type="text" onChange={handleText} value={item}/>
            <input type="submit"/>
          </form>
          <div className="container">
            <section>
              <h2>To Purchase</h2>
              {notPurchaseds}
            </section>
            <section>
              <h2>Purchased</h2>
              {purchaseds}
            </section>
          </div>
        </main>
      </div>
      <style jsx>{`
        .item + .item {
          margin-top: .5rem;
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
          -webkit-appearance: none;
        }

        .container{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }

        input[type="submit"] {
          background-color: rgba(0, 0, 0, 0.05);
          border: none;
          margin-top: .5em;
          border-radius: 2px;
          padding: 2px 4px;
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
          display: block;
        }

        input[name="task"]:focus {
          outline: none;
        }

        label {
          font-size: 18px;
        }
      `}</style>
    </Layout>
  )
}

export default Blog

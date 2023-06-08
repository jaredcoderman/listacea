import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Todo, { TodoProps } from "../components/Todo"
import { UserProps } from "../components/User"
import prisma from "../lib/prisma"

// export const getStaticProps: GetStaticProps = async () => {
//   const feed = [
//     {
//       id: "3",
//       name: "Working out 360 times this year!",
//       completed: false,
//       owner: {
//         name: "Jared",
//         email: "burk@prisma.io",
//       },
//     },
//   ]
//   return { 
//     props: { feed }, 
//     revalidate: 10 
//   }
// }

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const todos = await prisma.todo.findMany()

//   return {
//     props: { todos },
//   };
// };


type Props = {
  todos: TodoProps[]
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
    await fetch('/api/v1/todo', {
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
      const response = await fetch("/api/v1/todo", {
        method: "GET",
      })
      if(response.status === 204) return
      const newTasks = await response.json()
      let newPurchased = []
      let newNotPurchased = []
      for(let task of newTasks.todos) {
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

  let notPurchaseds = notPurchased.map(todo => {
    todo.updateLists = updateLists
    return (
      <div key={todo.id} className="todo">
        <Todo todo={todo} />
      </div>
    )
  })

  let purchaseds = purchased.map(todo => {
    todo.updateLists = updateLists
    return (
      <div key={todo.id} className="todo">
        <Todo todo={todo} />
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
          {purchased.map((todo) => (
            <div key={todo.id} className="todo">
              <Todo todo={todo} />
            </div>
          ))}
          </section>
          </div>
        </main>
      </div>
      <style jsx>{`
        .todo + .todo {
          margin-top: .5rem;
        }
        
        main {
          display: flex;
          flex-direction: column;
        }

        .container{
          display: flex;
          flex-direction: row;
        }

        section + section {
          margin-left: 20%;
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

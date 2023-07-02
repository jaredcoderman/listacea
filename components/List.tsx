import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { mutate } from "swr"

export type ListProps = {
  name: string;
  id: number;
}

const List = props => {
  const { list } = props
  const [editing, setEditing] = useState(false)
  const [rename, setRename] = useState(list.name)
  const inputRef = useRef(null)

  const handleEdit = (e) => {
    setEditing(!editing)
  }
  
  const handleRename = async (e) => {
    if(e.currentTarget.value.length > 20) return
    setRename(e.currentTarget.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setEditing(false)
    if(list.name !== "rename") {
      try {
        const response = await fetch(`/api/v1/list/${list.id}`, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rename }),
          credentials: "include"
        })
        if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
        mutate("/api/v1/list")
      } catch(err) {
        console.error(err)
      }
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    const verify = confirm("Are you sure you want to delete this list? It will also delete all associated categories and items.")
    if(!verify) return
    try {
      let response = await fetch(`/api/v1/list/${list.id}`, {
        method: "DELETE"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate("/api/v1/list")
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Link href={`./list/${list.id}`} className="link">
      <div className={editing ? 'editing' : ''}>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={rename}
              ref={inputRef}
              onChange={handleRename}
              autoFocus
              onClick={(e) => e.preventDefault()}
            />
          </form>
        ) : (
          <span onClick={(e) => e.preventDefault()} onDoubleClick={handleEdit}>{rename}</span>
        )}
        <img src="/images/bin.png" onClick={handleDelete}/>
        <style jsx>
          {`
            form {
              width: 100%;
              display: inline;
            }

            img {
              height: 18px;
              width: 18px;
              vertical-align: middle;
              float: right;
              margin-right: 8px;
              margin-top: 2px;
              opacity: 0;
              z-index: 1
            }

            input {
              border: none;
              background-color: transparent;
              font-weight: bold;
              display: inline;
              padding: 0;
              font-family: inherit;
            }

            input:focus {
              outline: none;
            }

            img:hover {
              color: white;
            }

            div {
              background-color: transparent;
              padding: 4px 0px 4px 15px;
              border: solid 1px black;
              border-radius: 5px;
              cursor: pointer;
              width: 250px;
              text-align: left;
              margin: 5px;
              z-index: 0
            }

            div:hover {
              background-color: white;
              transition: .25s;
            }

            div:hover img {
              opacity: 1;
            }

            .editing {
              border-color: orange;
              box-shadow: 0 0 5px orange;
              background-color: white;
              display: flex;
            }

            span {
              font-weight: bold;
            }
          `}
        </style>
      </div>
    </Link>
  )
}

export default List

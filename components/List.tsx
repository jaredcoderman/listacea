import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { mutate } from "swr"

export type ListProps = {
  name: string;
  id: number;
}

type Props = {
  list: ListProps;
  editingLists: boolean;
}

const List: React.FC<Props> = (props) => {
  const { list, editingLists } = props
  const [editing, setEditing] = useState(false)
  const [rename, setRename] = useState(list.name)
  const inputRef = useRef(null)

  const handleEdit = (e) => {
    if(editingLists) {
      e.preventDefault()
      setEditing(!editing)
    }
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
      <div onClick={handleEdit} className={editing ? 'editing' : ''}>
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
          <span>{rename}</span>
        )}
        {editingLists && <img src="/images/bin.png" onClick={handleDelete}/>}
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
              z-index: 1
            }

            input {
              border: none;
              background-color: transparent;
              font-weight: normal;
              display: inline;
              padding: 0;
              font-family: inherit;
            }

            input:focus {
              outline: none;
            }

            div {
              background-color: var(--main-button-bg);
              color: var(--main-button-color);
              padding: 7px 0px 7px 15px;
              font-size: 17px;
              border-radius: 5px;
              cursor: pointer;
              width: 250px;
              text-align: left;
              margin: 5px;
              z-index: 0;
              transition: .25s;
            }

            div:hover {
              background-color: black;
              color: white;
              transform: translate(0, -3px);
            }

            .editing {
              border-color: orange;
              box-shadow: 0 0 5px orange;
              background-color: white;
              display: flex;
            }

            span {
              font-weight: normal;
            }
          `}
        </style>
      </div>
    </Link>
  )
}

export default List

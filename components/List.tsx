import { useSession } from "next-auth/react";
import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { mutate } from "swr"

export type ListProps = {
  name: string;
  id: number;
  ownerEmail: string;
}

type Props = {
  list: ListProps;
  editingLists: boolean;
}

const List: React.FC<Props> = (props) => {
  const { data: session, status } = useSession()
  const { list, editingLists } = props
  const [editing, setEditing] = useState(false)
  const [rename, setRename] = useState(list.name)
  const inputRef = useRef(null)

  const handleEdit = (e) => {
    if(session.user.email !== list.ownerEmail) return
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
    e.stopPropagation()
    let verifyMessage = session.user.email === list.ownerEmail ? 'Are you sure you want to delete this list? It will also delete all associated categories and items.' : 'Are you sure you want to leave this list? You can be added back later.'
    const verify = confirm(verifyMessage)
    if(!verify) return
    if(session.user.email === list.ownerEmail) {
      try {
        let response = await fetch(`/api/v1/list/${list.id}`, {
          method: "DELETE"
        })
        if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
        mutate("/api/v1/list")
      } catch(err) {
        console.error(err)
      }
    } else {
      try {
        let userToDelete = session.user.email
        let response = await fetch(`/api/v1/list/${list.id}`, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userToDelete }),
          credentials: "include"
        })
        if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
        mutate("/api/v1/list")
      } catch(err) {
        console.error(err)
      }
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
      <div onClick={handleEdit} className={(session.user.email === list.ownerEmail ? 'ownedList ' : '') + (editing ? 'editing' : '')}>
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
        {editingLists && <img src={`/images/${session.user.email === list.ownerEmail ? 'bin' : 'logout'}.png`} className={session.user.email === list.ownerEmail ? 'bin' : 'leave'} onClick={(e) => handleDelete(e)}/>}
        <style jsx>
          {`
            form {
              width: 100%;
              display: inline;
            }

            .bin {
              height: 18px;
              width: 18px;
              vertical-align: middle;
              float: right;
              margin-right: 8px;
              margin-top: 2px;
              z-index: 1
            }

            .leave {
              height: 18px;
              width: 18px;
              vertical-align: middle;
              float: right;
              margin-right: 11px;
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

            .ownedList {
              background-color: var(--accent);
            }

            div:hover {
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

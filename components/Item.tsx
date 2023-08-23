import React, { useState, useRef, useEffect } from "react";
import useSWR, { mutate } from "swr"


export type ItemProps = {
  name: string;
  id: number;
  purchased: boolean;
  categoryId: number;
}

type Props = {
  item: ItemProps;
  listId: number;
  editingAll: boolean;
}

const Item: React.FC<Props> = (props) => {
  const { item, listId, editingAll } = props
  const [editing, setEditing] = useState(false)
  const [rename, setRename] = useState(item.name)
  const inputRef = useRef(null)

  const url = `/api/v1/list/${listId}/category/${item.categoryId}/item/${item.id}`
  const handleClick = async (e) => {
    try {
      const bool = !item.purchased
      const response = await fetch(url, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bool }),
        credentials: "include"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate(`/api/v1/list/${listId}/category`)
    } catch(err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEditing(false)
    if(item.name !== "rename") {
      try {
        const response = await fetch(`/api/v1/list/${listId}/category/${item.categoryId}/item/${item.id}`, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rename }),
          credentials: "include"
        })
        if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
        mutate(`/api/v1/list/${listId}/category`)
      } catch(err) {
        console.error(err)
      }
    }
  }

  const handleRename = (e) => {
    if(e.currentTarget.value.length > 50) return
    setRename(e.currentTarget.value)
  }

  const handleEdit = (e) => {
    e.preventDefault()
    if(editingAll) setEditing(true)
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
  
  const handleDelete = async () => {
    const verify = confirm(`Are you sure you want to delete item: '${item.name}'?`)
    if(!verify) return
    try {
      const response = await fetch(`/api/v1/list/${listId}/category/${item.categoryId}/item/${item.id}`, {
        method: "DELETE",
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate(`/api/v1/list/${listId}/category`)
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div>
      {editingAll && <img className="delete" src="/images/bin.png" onClick={handleDelete}/>}
      <img onClick={handleClick} src={item.purchased ? "/images/checkbox.png" : "/images/unchecked.png"} />
      {editing ? (
            <form className={'edit-form ' + (editing ? 'editing-form' : '')} onSubmit={handleSubmit}>
              <input
                type="text"
                className='item-field'
                value={rename}
                ref={inputRef}
                onChange={handleRename}
                autoFocus
                onClick={(e) => e.preventDefault()}
              />
            </form>
          ) : (
            <span className={editing ? 'editing' : ''} onClick={(e) => handleEdit(e)}>{rename}</span>
          )}

      <style jsx>
      {`
        img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
          cursor: pointer;
          margin-bottom: 2px;
          margin-right: .2rem;
        }

        .delete {
          width: 16px;
          height: 16px;
          margin-top: 2px;
        }

        .edit-form {
          width: 100%;
          display: inline;
          font-size: 16px;
        }

        .item-field {
          border: none;
          border-color: orange;
          box-shadow: 0 0 5px orange;
          background-color: white;
          display: inline;
          padding-left: 3px;
          font-family: inherit;
          font-size: 16px;
          margin-left: .25rem;
          border-radius: 3px;
          outline: none;
        }

        .editing-form {
          top: -5px;
        }

        span {
          margin-left: .25rem;
          font-size: 16px;
          max-width: 200px;
        }
        div {
          display: flex;
          margin-top: 3px;
        }
      `}
      </style>
    </div>
  )
}

export default Item
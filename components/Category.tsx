import React, { useState, useEffect, useRef } from "react"
import { mutate } from "swr"
import { ListProps } from "./List"
import { ItemProps } from "./Item"
import Item from "./Item"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes } from "../utils/constants"

export type CategoryProps = {
  name: string;
  items: ItemProps[];
  id: number;
  listId: number;
  index: number;
}

type Props = {
  category: CategoryProps;
  editingAll: boolean;
}

const Category: React.FC<Props> = (props) => {
  const { category, editingAll } = props
  const [rename, setRename] = useState(category.name)
  const [editing, setEditing] = useState(false)
  const [newItem, setNewItem] = useState("")
  const inputRef = useRef(null)
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.CATEGORY,
    item: {category: category},
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CATEGORY,
      drop: (category) => handleDrop(category),
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
  )
  
  const handleDrop = async (draggedData) => {
    const draggedCategory = draggedData.category
    const draggedCategoryId = draggedCategory.id;
    await fetch(`/api/v1/list/${category.listId}/category/${category.id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draggedCategoryId }),
      credentials: 'include',
    });
    mutate(`/api/v1/list/${category.listId}/category`);
  };
  

  const handleEdit = (e) => {
    e.preventDefault()
    if(editingAll) setEditing(true)
  }

  const handleRename = async (e) => {
    if(e.currentTarget.value.length > 20) return
    setRename(e.currentTarget.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setEditing(false)
    if(category.name !== "rename") {
      try {
        const response = await fetch(`/api/v1/list/${category.listId}/category/${category.id}`, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rename }),
          credentials: "include"
        })
        if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
        mutate(`/api/v1/list/${category.listId}/category`)
      } catch(err) {
        console.error(err)
      }
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    const verify = confirm("Are you sure you want to delete this category? It will also delete all associated items.")
    if(!verify) return
    try {
      let response = await fetch(`/api/v1/list/${category.listId}/category/${category.id}`, {
        method: "DELETE"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      mutate(`/api/v1/list/${category.listId}/category`)
    } catch(err) {
      console.error(err)
    }
  }

  const itemMap = category.items.map(item => {
    return <Item editingAll={editingAll} item={item} key={item.id} listId={category.listId} />
  })

  const handleNewItem = e => {
    if(e.currentTarget.value.length > 50) return
    setNewItem(e.currentTarget.value)
  }

  const handleNewItemSubmit = async e => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/v1/list/${category.listId}/category/${category.id}/item`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newItem }),
        credentials: "include",
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      setNewItem("")
      mutate(`/api/v1/list/${category.listId}/category`)
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
      <div
        ref={drop}
      >
          <div
            ref={drag}
            className="outer"
            style={{
              opacity: isDragging ? 0.5 : 1,
              fontSize: 25,
              fontWeight: 'bold',
              cursor: 'move',
            }}
          >
          <div className={"category-container " + (editing ? 'editing' : '')}>
            {editing ? (
              <form className={'edit-form ' + (editing ? 'editing-form' : '')} onSubmit={handleSubmit}>
                <input
                  type="text"
                  className='category-field'
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
            {editingAll && <img src="/images/bin.png" onClick={handleDelete}/>}
          </div>
          {itemMap}
          {editingAll && (
            <form className="new-item-form" onSubmit={handleNewItemSubmit}>
              <input onChange={handleNewItem} value={newItem} placeholder="new.." className="new-item" type="text" />
            </form>
          )}
          <style jsx>
              {`
                .edit-form {
                  width: 100%;
                  display: inline;
                }

                .editing-form {
                  border-color: orange;
                  outline: 1px solid orange;
                  box-shadow: 0 0 5px orange;
                  background-color: white;
                  border-radius: 3px;
                  padding-left: 4px;
                  padding-bottom: 2px; 
                }

                .outer {
                  margin-bottom: 2rem;
                }

                img {
                  height: 18px;
                  width: 18px;
                  float: right;
                  margin-top: 9px;
                  margin-left: 1rem;
                  vertical-align: middle;
                }

                .category-field {
                  border: none;
                  background-color: transparent;
                  font-weight: bold;
                  display: inline;
                  padding: 0;
                  font-family: inherit;
                  font-size: 24px;
                }

                .category-field:focus {
                  outline: none;
                }

                .new-item-form {
                  margin-top: 1rem;
                }

                .new-item {
                  opacity: .8;
                  border: none;
                  width: 55%;
                  border-bottom: solid 1px black;
                  border-radius: 3px;
                  outline: none;
                  color: black;
                  background-color: transparent;
                }

                .new-item:focus {
                  opacity: 1;
                }

                img:hover {
                  color: white;
                }

                .category-container {
                  border-radius: 5px;
                  margin-bottom: .5rem;
                  cursor: pointer;
                  text-align: left;
                  width: 250px;
                  z-index: 0
                }

                .editing {
                  display: flex;
                }

                span {
                  font-weight: bold;
                  font-size: 24px;
                }
              `}
            </style>
        </div>       
      </div>  
  )
}

export default Category

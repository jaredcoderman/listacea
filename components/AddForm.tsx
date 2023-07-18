import React, { useState } from "react"
import { mutate } from "swr";

export type Props = {
  adding: boolean;
  route: string;
  placeholder: string;
  setEditingAll: React.Dispatch<React.SetStateAction<boolean>>;
  bulkOption: boolean;
};

const AddForm: React.FC<Props> = (props) => {
  const [name, setListName] = useState("")
  const [bulkList, setBulkList] = useState("")
  const [bulk, setBulk] = useState(false)
  const { adding, route, placeholder, setEditingAll, bulkOption } = props

  const handleChange = e => {
    if(bulk) {
      setBulkList(e.currentTarget.value)
    } else {
      if(e.currentTarget.value.length > 20) return
      setListName(e.currentTarget.value)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if(!bulk) {
      await fetch(`/api/v1/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
        credentials: "include"
      })
      setListName("")
      if(setEditingAll) setEditingAll(true)
      mutate(`/api/v1/${route}`)
    } else {
      await fetch(`/api/v1/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkList }),
        credentials: "include"
      })
      setBulkList("")
      if(setEditingAll) setEditingAll(false)
      mutate(`/api/v1/${route}`)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {!bulk ? (
          <input className={`text ${adding ? 'show' : ''}`} placeholder={placeholder} value={name} onChange={handleChange} autoComplete="off" type='text' />) : (
            <input className={`textarea ${adding ? 'show' : ''}`} placeholder='long list of items' value={bulkList} onChange={handleChange} autoComplete="off" type='textarea' />
        )}
        {bulkOption && <input
          id="bulkCheckbox"
          type="checkbox"
          onChange={() => {setBulk(!bulk)}}
          checked={bulk}
          className={adding ? 'show-check' : 'hide-check'}
        />}

        {bulkOption && <label htmlFor="bulkCheckbox" className={adding ? 'show-check' : 'hide-check'}>Bulk?</label>}
      </form>
      <style jsx>
        {`
        div {
          align-self: center;
        }

        label {
          font-family: inherit;
          font-size: 14px;
        }

        img {
          width: 27px;
          height: 27px;
        }

        input[type='checkbox'] {
          margin-left: 1rem;
          accent-color: black;
        }

        .show-check {
          display: inline
        }

        .hide-check {
          display: none;
        }

        button {
          border: none;
        }

        form {
          display: flex;
          margin-top: 
        }

        .text {
          border: none;
          border-bottom: solid 1px black;
          background-color: transparent;
          align-self: center;
          display: block;
          overflow: hidden;
          width: 0px;
          opacity: 0;
          width: 0px;
          transition: 0.5s;
        }

        .text.show {
          width: 175px;
          opacity: 1;
        }

        .text:focus {
          padding: 3px;
          padding-top: 4px;
        }
        `}
      </style>
    </div>

  )
}

export default AddForm
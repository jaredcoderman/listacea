import React, { useState } from "react"
import { mutate } from "swr";

export type Props = {
  adding: boolean;
  route: string;
  placeholder: string;
  setEditingAll: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddForm: React.FC<Props> = (props) => {
  const [name, setListName] = useState("")
  const { adding, route, placeholder, setEditingAll } = props

  const handleChange = e => {
    if(e.currentTarget.value.length > 20) return
    setListName(e.currentTarget.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await fetch(`/api/v1/${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: "include"
    })
    setListName("")
    if(setEditingAll) setEditingAll(true)
    mutate(`/api/v1/${route}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input className={`text ${adding ? 'show' : ''}`} placeholder={placeholder} value={name} onChange={handleChange} autoComplete="off" type='text' />
      </form>
      <style jsx>
        {`
        div {
          align-self: center;
        }

        img {
          width: 27px;
          height: 27px;
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
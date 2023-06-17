import React, { useState } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Item } from "@prisma/client";
import Image from "next/image";
import { CategoryProps } from "./Category";

export type ItemProps = {
  id: number;
  title: string;
  purchased: boolean;
  category: CategoryProps;
  name: string;
  updateLists: () => any;
  editing: boolean;
};

const Item: React.FC<{ item: ItemProps }> = (props) => {
  const { item } = props
  const [rename, setRename] = useState(item.name)
  const handleComplete = async (event) => {
    if (item.editing) {
      let yes = confirm(`Are you sure you want to delete \"${item.name}\"?`)
      if (!yes) return
      await fetch(`/api/v1/item/${item.id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
      })
    } else {
      await fetch(`/api/v1/item/${item.id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
      })
    }
    item.updateLists()
  }

  const updateItem = async (event) => {
    event.preventDefault()
    console.log(rename)
    await fetch(`/api/v1/item/${item.id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rename }),
      credentials: "include"
    })
    item.updateLists()
  }

  const capitalize = str => {
    let words = str.split(" ")
    let result = ""
    for(let word of words) {
      result += word.charAt(0).toUpperCase() + word.substring(1, word.length) + " "
    }
    return result
  }

  let iconPath = "images/unchecked.png"
  let className = ""
  let itemText: any = capitalize(item.name)
  if (item.editing) {
    iconPath = "images/bin.png"
    className = "editing"
    itemText = <form className="editForm" onSubmit={updateItem}>
      <input type="text" value={rename} onChange={(event) => { setRename(event.currentTarget.value) }} />
      <style jsx>
        {`
          form {
            display: inline;
          }
          input {
            width: 75%;
            font-size: 16px;
          }
        `}
      </style>
    </form>
  } else if (item.purchased) {
    iconPath = "images/checkbox.png"
  }

  let image = <img alt="" src={iconPath} onClick={handleComplete} width="17px"
    height="17px" />
  return (
    <div>
      <label>
        <div className="checkbox-wrapper">
          {image}
        </div>
        <div className='form-wrapper'>
          {itemText}
        </div>
        <div className="bin-wrapper">
          <Image
            src="/images/bin.png"
            width="15px"
            height="15px"
            alt="Loading..."
          />
        </div>
      </label>

      <style jsx>{`
        div {
          color: inherit;
          display: flex;
          flex-direction: column;
        }

        .form-wrapper {
          text-align: center;
          display: inline;
        }

        .checkbox-wrapper{
          display: inline;
          cursor: pointer;
          vertical-align: middle;
          margin-right: 6px;
        }

        .bin-wrapper {
          display: inline;
          cursor: pointer;
          vertical-align: middle;
          display: none;
        }

        label {
          font-size: 16px;
        }

        img:hover {
          cursor: pointer !important;
        }

        button {
          border: none;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default Item;
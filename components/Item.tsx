import React, { useState } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Item } from "@prisma/client";
import Image from "next/image";

export type ItemProps = {
  id: number;
  title: string;
  user: {
    name: string;
    email: string;
  } | null;
  purchased: boolean;
  name: string;
  updateLists: () => any;
};

const Item: React.FC<{ item: ItemProps }> = (props) => {
  const { item } = props
  const handleComplete = async (event) => {
    await fetch(`/api/v1/item/${item.id}`, {
      method: "PATCH",
      headers: {'Content-Type': 'application/json'},
      credentials: "include"
    })
    item.updateLists()
  }
  const handleDelete = (event) => {
    
  }

  let checkbox = <img alt="" src="images/unchecked.png" className="button" onClick={handleComplete} width="17px"
  height="17px"/>
  if(item.purchased) {
    checkbox = <img alt="" src="images/checkbox.png" onClick={handleComplete} width="17px"
    height="17px"/>
  }
  return (
    <div> 
      <label>
        {item.name}
        {checkbox}
        <Image
            src="/images/bin.png"
            width="16px"
            height="16px"
            alt="Loading..."
          />
      </label>
      
      <style jsx>{`
        div {
          color: inherit;
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 16px;
        }

        .button:hover {
          cursor: pointer;
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
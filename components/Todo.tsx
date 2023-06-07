import React, { useState } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type TodoProps = {
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

const Todo: React.FC<{ todo: TodoProps }> = (props) => {
  const { todo } = props
  const handleComplete = async (event) => {
    await fetch(`/api/v1/todo/${todo.id}`, {
      method: "PATCH",
      headers: {'Content-Type': 'application/json'},
      credentials: "include"
    })
    todo.updateLists()
  }
  
  const handleDelete = (event) => {
    
  }

  let checkbox = "🔲"
  if(todo.purchased) {
    checkbox = "☑️"
  }
  return (
    <div> 
      <label>
        {todo.name}
        <button onClick={handleComplete}>{checkbox}</button>
        <button onClick={handleDelete}>🗑️</button>
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

        button {
          border: none;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default Todo;

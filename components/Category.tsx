import { Category } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

export type CategoryProps = {
  id: number;
  name: string;
  user: {
    name: string;
    email: string;
  } | null;
  editing: boolean;
  updateLists: () => any;
}

const Category: React.FC<{ category: CategoryProps }> = props => {
  const { category } = props
  const [rename, setRename] = useState(category.name)

  const updateCategory = async (event) => {
    event.preventDefault()
    console.log(rename)
    await fetch(`/api/v1/category/${category.id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rename }),
      credentials: "include"
    })
    category.updateLists()
  }

  const deleteCategory = async (event) => {
    if (category.editing) {
      let yes = confirm(`Are you sure you want to delete \"${category.name}\. You will also be deleting the associated grocery items."?`)
      if (!yes) return
      await fetch(`/api/v1/category/${category.id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
      })
    }
    category.updateLists()
  }

  let icon: any = ""
  let categoryText: any = <div><span>{category.name}</span><style jsx>
  {`
    div {
      margin-bottom: 5px;
      font-weight: bold;
      border: solid black 1px;
      border-radius: 3px;
      padding: 5px 10px;
      background-color: white;
    }
  `}
</style>
    
    </div>
  if (category.editing) {
    icon = <Image
      src="/images/bin.png"
      width="15px"
      height="15px"
      alt="Loading..."
      onClick={deleteCategory}
    />
    categoryText = <form className="editForm" onSubmit={updateCategory}>
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
  }
  return (
    <div>
      {icon}
      <span>{categoryText}</span>
    </div>

  )
}

export default Category
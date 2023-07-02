import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import useSWR from "swr"
import React, { useState } from "react"
import AddButton from "../../components/AddButton"
import Category from "../../components/Category"

export type List = {
  id: number
  name: string
}

const fetchList = async (url: string) => {
  const response = await fetch(url, {
    method: "GET"
  })
  const responseBody = await response.json()
  return responseBody.list
}

const ListShow = (props) => {
  const router = useRouter()
  const id = router.query.id && router.query.id[0]
  const [editingAll, setEditingAll] = useState(false)


  const url = id ? `/api/v1/list/${id}` : null
  const { data: list } = useSWR(url, fetchList)

  const fetchCategories = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
    });
    const responseBody = await response.json();
    return responseBody.categories;
  };

  const categoryUrl = id ? `${url}/category` : null
  const { data: categories } = useSWR(categoryUrl, fetchCategories)

  const categoryMap = categories ? categories.map(category => {
    return <Category editingAll={editingAll} category={category} key={category.id}/>
  }) : null

  return (
    <Layout>
      <div>
        <h1>{list && list.name}</h1>
        <img onClick={() => setEditingAll(!editingAll)} className="edit-button" src={editingAll ? "/images/editing.png": '/images/edit.png'} />
        {categoryMap}
        <AddButton placeholder="new category" imgSrc="new-category.png" route={`list/${id}/category`}/>
      </div>
      <style jsx>
      {`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        img {
          width: 34px;
          height: 34px;
          cursor: pointer;
          margin-bottom: 2rem;
        }
      `}
      </style>
    </Layout>
  )
}

export default ListShow

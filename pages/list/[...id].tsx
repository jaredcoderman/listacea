import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import useSWR from "swr"
import React, { useEffect, useState } from "react"
import AddButton from "../../components/AddButton"
import Category from "../../components/Category"
import { useSession } from "next-auth/react"
import LoadingSpinner from "../../components/LoadingSpinner"

export type List = {
  id: number
  name: string
  hasBeenChecked: boolean;
}

const fetchList = async (url: string) => {
  const response = await fetch(url, {
    method: "GET"
  })
  const responseBody = await response.json()
  return responseBody.list
}

const fetchCategories = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
  });
  const responseBody = await response.json();
  return responseBody.categories;
};

const ListShow = (props) => {
  const router = useRouter()  
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const id = router.query.id && router.query.id[0]

  const [editingAll, setEditingAll] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")

  const url = id ? `/api/v1/list/${id}` : null
  const { data: list } = useSWR(url, fetchList)
  const categoryUrl = id ? `${url}/category` : null
  const { data: categories } = useSWR(categoryUrl, fetchCategories)

  const categoryMap = categories ? categories.map(category => {
    return <Category editingAll={editingAll} category={category} key={category.id}/>
  }) : null

  const handleShare = async () => {
    const email = prompt("Enter the user's email address")
    if(!email) return
    try {
      const response = await fetch(`/api/v1/list/${id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: "include"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      const responseBody = await response.json()
      setResponseMessage(responseBody.message)
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <Layout>
      <div>
        {!list && <LoadingSpinner />}
        <h1>{list && list.name}</h1>
        <span className={responseMessage.includes("not") ? "error" : "success"}>{responseMessage}</span>
        <div className="menu">
          {categories && categories.length > 0 && <img onClick={() => setEditingAll(!editingAll)} className="edit-button" src={editingAll ? "/images/editing.png": '/images/edit.png'} />}
          {categories && <img onClick={handleShare} src="/images/share.png" />}
        </div>
        {categoryMap}
        {categories && <AddButton setEditingAll={setEditingAll} placeholder="new category" imgSrc="new-category.png" route={`list/${id}/category`}/>}

      </div>
      <style jsx>
      {`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .menu {
          flex-direction: row;
        }

        img {
          width: 34px;
          height: 34px;
          cursor: pointer;
          margin-bottom: 2rem;
          margin-left: 1rem;
          margin-right: 1rem;
        }

        span {
          font-size: 13px;
          margin-bottom: 1rem;
        }

        .error {
          color: #FF1a1a;
        }

        .success {
          color: #3291ff;
        }
      `}
      </style>
    </Layout>
  )
}

export default ListShow

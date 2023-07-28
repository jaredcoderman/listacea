import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import useSWR from "swr"
import React, { useEffect, useState } from "react"
import AddButton from "../../components/AddButton"
import Category from "../../components/Category"
import { useSession } from "next-auth/react"
import LoadingSpinner from "../../components/LoadingSpinner"
import ShareModal from "../../components/ShareModal"
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline

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
  const[modalOpen, setModalOpen] = useState(false)

  const url = id ? `/api/v1/list/${id}` : null
  const { data: list } = useSWR(url, fetchList)
  const categoryUrl = id ? `${url}/category` : null
  const { data: categories } = useSWR(categoryUrl, fetchCategories)

  const categoryMap = categories ? categories.map(category => {
    return <Category editingAll={editingAll} category={category} key={category.id}/>
  }) : null

  const handleShare = async () => {
    setModalOpen(!modalOpen)
  }

  let isOwner = false
  if(list && session) {
    if(list.ownerEmail === session.user.email) isOwner = true
  }

  return (
    <Layout>
      <div>
        {!list && <LoadingSpinner />}
        <h1>{list && list.name}</h1>
        {list && modalOpen && <ShareModal isOwner={isOwner} list={list} setModalOpen={setModalOpen} users={list.users} />}
        <div className="menu">
          {categories && categories.length > 0 && <img onClick={() => setEditingAll(!editingAll)} className="edit-button" src={editingAll ? "/images/editing.png": '/images/edit.png'} />}
          {categories && <img onClick={handleShare} src="/images/share.png" />}
        </div>
        <div className='category-container'>
          <DndProvider options={HTML5toTouch}>
            {categoryMap}
          </DndProvider>

        </div>
        {categories && <AddButton bulkOption={false} setEditingAll={setEditingAll} placeholder="new category" imgSrc="new-category.png" route={`list/${id}/category`}/>}

      </div>
      <style jsx>
      {`
        .category-container {
          display: flex;
        }
        div {
          position: relative;
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

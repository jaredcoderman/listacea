import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Item, { ItemProps } from "../components/Item"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from 'next/router'


type Props = {
  items: ItemProps[]
}

type CategoryObject = {
  [category: string]: ItemProps[];
}

type Items = {
  [category: string]: ItemProps[]
}
 

const Home: React.FC<Props> = (props) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  if(status === "authenticated") {
    router.push("/list")
  }
  return(
    <Layout>
      <div className="call-to-action">
        <h1>Welcome</h1>
        <h4>Groceries Made Simple</h4>
        <Link href="/api/auth/signin">
          <a>Get Started</a>
        </Link>
      </div>
      <div className="explanation">
        <h3>How It Works</h3>
        <div className="guide">
          <p>1. Make an account</p>
          <p>2. Make categories for your groceries</p>
          <p>3. Make items for those categories</p>
          <p>4. Check and uncheck off items as needed</p>
        </div>
      </div>
      <style jsx>{`
        .call-to-action {
          display: flex;
          margin-left: auto;
          margin-right: auto;
          flex-direction: column;
        } 

        .guide {
          display: table;
          margin-left: auto;
          margin-right: auto;
        }

        h1 {
          text-align: center;
          font-size: 40px;
        }

        h4 {
          text-align: center;
          font-weight: normal;
        }

        h3 {
          margin-top: 4rem;
          text-align: center;
        }

        a {
          text-decoration: none;
          background-color: #transparent;
          color: black;
          border-radius: 5px;
          padding: 2px 8px;
          font-size: 14px;
          background-color: white;
          border: solid 1px black;
          margin-left: auto;
          margin-right: auto;
          font-weight: bold;
          padding: 5px 10px;
        }
      `}</style>
    </Layout>
  )
}

export default Home

import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from 'next/router'

const Home = (props) => {
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
        <Link legacyBehavior href="/api/auth/signin">
          <a>Get Started</a>
        </Link>
      </div>
      <div className="explanation">
        <h3>How It Works</h3>
        <div className="guide">
          <p>1. Make an account</p>
          <p>2. Make lists (i.e. groceries)</p>
          <p>3. Make categories for your lists</p>
          <p>4. Put items in those categories</p>
          <p>5. Check off items when purchased and uncheck when you need more</p>
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
          font-size: 14px;
          background-color: white;
          border: solid 1px black;
          margin-left: auto;
          margin-right: auto;
          font-weight: bold;
          padding: 5px 10px;
          transition: .25s;
        }

        a:hover {
          background-color: black;
          color: white;
          transition: .25s;
          padding: 8px 14px;
        }
      `}</style>
    </Layout>
  )
}

export default Home

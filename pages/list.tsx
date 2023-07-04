import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react"
import useSWR from "swr";
import AddButton from "../components/AddButton";
import ListIndex from "../components/ListIndex";
import Layout from "../components/Layout";

const List = (props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editingLists, setEditingLists] = useState(false)

  if (status === "unauthenticated") {
    router.push("/");
  }

  const fetchLists = async () => {
    const response = await fetch("/api/v1/list", {
      method: "GET",
    });
    const responseBody = await response.json();
    return responseBody.lists;
  };

  const { data: lists, error } = useSWR("/api/v1/list", fetchLists);

  if (error) {
    console.error("Error fetching lists:", error);
  }

  return (
    <Layout>
      <main>
        <h1>Your Lists</h1>
        {lists && lists.length > 0 && <img onClick={() => setEditingLists(!editingLists)} src={editingLists ? "/images/editing.png" : "/images/edit.png"} />}
        {lists && lists.length > 0 && <ListIndex lists={lists} editingLists={editingLists} />}
        <AddButton setEditingAll={null} placeholder="new list" imgSrc="new-file.png" route="list"/>
      </main>
      <style jsx>{`
        h1 {
          text-align: center;
        }

        img {
          width: 34px;
          height: 34px;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
};

export default List;

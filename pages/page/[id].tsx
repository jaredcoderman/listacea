import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { TodoProps } from "../../components/Item"
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const todo = await prisma.todo.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
  return {
    props: todo,
  };
};

const Todo: React.FC<TodoProps> = (props) => {
  let name = props.name

  return (
    <Layout>
      <div>
        <h2>{name}</h2>
        <p>By {props?.user?.name || "Unknown owner"}</p>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Todo

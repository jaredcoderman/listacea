import React from "react"
import List, { ListProps } from "./List"

type Props = {
  lists: ListProps[];
  editingLists: boolean;
}

const ListIndex: React.FC<Props> = (props) => {
  const { lists, editingLists } = props
  const listMap = lists.map(list => {
    return(
      <List editingLists={editingLists} list={list} key={list.id}/>
    )
  })

  return(
    <div>
      {listMap}
      <style jsx>
      {`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}
      </style>
    </div>
  )
}

export default ListIndex
import React from "react"
import List from "./List"

const ListIndex = (props) => {
  const { lists } = props
  const listMap = lists.map(list => {
    return(
      <List list={list} key={list.id}/>
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
import React from 'react'
import AragonBanner from '../components/aragon-banner'
import TopBanner from '../components/top-banner'
import AddTx from '../components/add-tx'

const NewList = ({}) => {
  return (
    <>
      <TopBanner
        description="Add TXs to create a list of governor enforcements."
        title="New List"
      />
      <AragonBanner />
      <AddTx />
    </>
  )
}

export default NewList

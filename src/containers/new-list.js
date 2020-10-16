import React from 'react'
import SnapshotBanner from '../components/snapshot-banner'
import TopBanner from '../components/top-banner'
import AddTx from '../components/add-tx'

const NewList = ({}) => {
  return (
    <>
      <TopBanner
        description="Add TXs to create a list of governor enforcements."
        title="New List"
      />
      <SnapshotBanner project={'kleros'} />
      <AddTx />
    </>
  )
}

export default NewList

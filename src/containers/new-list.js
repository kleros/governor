import React from 'react'
import AragonBanner from '../components/aragon-banner'
import TopBanner from '../components/top-banner'

const NewList = ({}) => {
  return (
    <>
      <TopBanner
        description="Add TXs to create a list of governor enforcements."
        title="New List"
      />
      <AragonBanner />
    </>
  )
}

export default NewList

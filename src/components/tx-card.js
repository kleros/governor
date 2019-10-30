import React from 'react'
import styled from 'styled-components'

const TxCardContainer = styled.div`
  background: transparent;
  box-shadow: 0px 6px 36px #BC9CFF;
  color: #4D00B4;
  border-radius: 12px;
  margin-bottom: 14px;
  width: 95%;
`
const TxCardHeader = styled.div`
  background: #F5F1FD;
  padding: 13px 23px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`
const TxNumber = styled.div`
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 14px;
`
const TxTitle = styled.div`
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 14px;
`
const TxCardBody = styled.div`
  background: #fff;
  padding: 13px 23px;
  overflow-wrap: break-word;
  margin-bottom: 14px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`

const TxCard = ({ tx, number = 1 }) => {

  return (
    <TxCardContainer>
      <TxCardHeader>
        <TxNumber>TX {number}</TxNumber>
        <TxTitle>
          { tx.title }
        </TxTitle>
      </TxCardHeader>
      <TxCardBody>
        { `Tx=(${tx.address},${tx.amount},${tx.data})` }
      </TxCardBody>
    </TxCardContainer>
  )
}

export default TxCard

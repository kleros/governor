import { Row, Col } from 'antd'
import React from 'react'
import TitledListCard from './titled-list-card'
import TxCard from './tx-card'
import styled from 'styled-components'

const SubmitterDiv = styled.div`
  color: #fff;
`

const List = () => {
  return (
    <TitledListCard
      title={'List 1'}
      prefix={'Txs'}
      extra={(
        <SubmitterDiv>Submitter</SubmitterDiv>
      )}
    >
      <Row>
        { [1,2,3].map(num => (
          <Col lg={12}>
            <TxCard number={num} />
          </Col>
        ))}
      </Row>
    </TitledListCard>
  )
}

export default List

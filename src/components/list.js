import { Row, Col } from 'antd'
import React from 'react'
import TitledListCard from './titled-list-card'
import TxCard from './tx-card'
import styled from 'styled-components'

const SubmitterDiv = styled.div`
  color: #fff;
`

const List = ({ txs = [], number = 1, submitter = '' }) => {
  return (
    <>
      {
        txs.length > 0 ? (
          <TitledListCard
            title={`List ${number}`}
            prefix={'Txs'}
            extra={(
              <SubmitterDiv>Submitter {submitter}</SubmitterDiv>
            )}
          >
            <Row>
              { txs.map((tx, i) => (
                <Col lg={12}>
                  <TxCard tx={tx} number={i+1} />
                </Col>
              ))}
            </Row>
          </TitledListCard>
        ) : ''
      }
    </>
  )
}

export default List

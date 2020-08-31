import { Row, Col } from 'antd'
import React from 'react'
import TitledListCard from './titled-list-card'
import TxCard from './tx-card'
import ListItem from './list-item'
import styled from 'styled-components'

const SubmitterDiv = styled.div`
  color: #fff;
`
const List = ({ txs = [], number = 1, submitter = '', onRemove = null }) => {
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
            white={false}
          >
            <Row>
              { txs.map((tx, i) => (
                <Col lg={12} key={i}>
                  <TxCard tx={tx} number={i+1} onRemove={onRemove}/>
                </Col>
              ))}
            </Row>
          </TitledListCard>
        ) : (
          <TitledListCard
            title={`List ${number}`}
            prefix={'Txs'}
            extra={(
              <SubmitterDiv>Submitter {submitter}</SubmitterDiv>
            )}
            white={true}
          >
            <ListItem>
              This list is empty. It signifies no changes for this session.
            </ListItem>
          </TitledListCard>
        )
      }
    </>
  )
}

export default List

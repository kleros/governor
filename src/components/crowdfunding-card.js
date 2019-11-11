import { Icon, Row, Col, Card, Progress } from 'antd'
import React from 'react'
import ReactBlockies from 'react-blockies'
import { useDrizzle, useDrizzleState } from '../bootstrap/drizzle-react-hooks'

import styled from 'styled-components'

const StyledCrowdfundingCard = styled(Card)`
  background: #F5F1FD;
  box-shadow: 0px 6px 36px rgba(24, 0, 255, 0.25);
  border-radius: 12px;
  color: #4D00B4;
  height: 240px;
  margin-bottom: 20px;
  width: 95%;
`
const StyledIcon = styled(Icon)`
  path {
    fill: #4D00B4;
  }
`
const StyledReactBlockies = styled(ReactBlockies)`
  border-radius: 12px;
`
const StyledText = styled.div`
  color: #4D00B4;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 20px;
  margin-top: 5px;
  text-align: center;
`
const StyledHeading = styled.div`
  color: #4D00B4;
  font-size: 18px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
`
const StyledProgress = styled(Progress)`
  .ant-progress-inner {
    background: #D09CFF;

    .ant-progress-bg {
      background: #4D00B4;
    }
  }
`

const CrowdfundingCard = ({ list, isFunded, currentAmount, winner }) => {
  const { drizzle, useCacheCall, useCacheEvents } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    account: drizzleState.accounts[0]
  }))

  console.log(list)

  return (
    <StyledCrowdfundingCard>
      <Row>
        <Col lg={2}>
          <StyledIcon type="clock-circle" theme="filled" />
        </Col>
        <Col lg={20}>
          Previous Round {winner ? 'Winner' : 'Loser'}
        </Col>
        <Col lg={2}>
          <a
            href={`https://etherscan.com/address/${drizzleState.account}`}
            target="_blank"
          >
            <StyledReactBlockies
              scale={4}
              seed={drizzleState.account.toLowerCase()}
              size={6}
            />
          </a>
        </Col>
      </Row>
      <div>
        List { list && list.listID }
      </div>
      <Row>
        <StyledProgress percent={30} showInfo={false} />
      </Row>
      <StyledText>If this side wins, you can receive 4/3's of your contribution</StyledText>
      <StyledHeading>33% Reward</StyledHeading>
    </StyledCrowdfundingCard>
  )
}

export default CrowdfundingCard

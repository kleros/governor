import { Icon, Row, Col, Card, Progress } from 'antd'
import React from 'react'
import ReactBlockies from 'react-blockies'
import { useDrizzle, useDrizzleState } from '../bootstrap/drizzle-react-hooks'
import TimeAgo from './time-ago'

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
const Deadline = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 16px;
  color: #F60C36;
`

const CrowdfundingCard = ({ list, isFunded, currentAmount, winner, totalFee, winnerMultiplier, loserMultiplier, winnerDeadline, loserDeadline }) => {
  const { drizzle, useCacheCall, useCacheEvents } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    account: drizzleState.accounts[0]
  }))

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
        <StyledProgress percent={Number(currentAmount) / Number(totalFee) * 100} showInfo={false} />
      </Row>
      <StyledText>If this side wins, you can receive your contribution multiplied by {winner ? `${(1 + Number(winnerMultiplier)/Number(loserMultiplier)).toFixed(2)}` : `${(1 + Number(loserMultiplier)/Number(winnerMultiplier)).toFixed(2)}`}</StyledText>
      <StyledHeading>{winner ? `${(1 + Number(winnerMultiplier)/Number(loserMultiplier)).toFixed(2)}x` : `${(1 + Number(loserMultiplier)/Number(winnerMultiplier)).toFixed(2)}x`} Reward</StyledHeading>
      <Deadline>
        <Row>
          <Col lg={2}>
            <Icon type="clock-circle" />
          </Col>
          <Col lg={22}>
            <span>{winner ? `Winner Deadline ` : `Loser Deadline `} <br/><TimeAgo>{winner ? winnerDeadline : loserDeadline}</TimeAgo></span>
          </Col>
        </Row>
       </Deadline>
    </StyledCrowdfundingCard>
  )
}

export default CrowdfundingCard

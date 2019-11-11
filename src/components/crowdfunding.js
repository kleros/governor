import { Card, Row, Col, Icon, Button } from 'antd'
import React from 'react'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'
import styled from 'styled-components'

import CrowdfundingCard from '../components/crowdfunding-card'

const StyledContainer = styled(Card)`
  background: linear-gradient(228.31deg, #4D00B4 17.46%, #1E075F 78.8%);
  box-shadow: 0px 6px 36px #BC9CFF;
  border-radius: 12px;
`
const StyledHeader = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  margin-bottom: 21px;
  text-align: center;
`
const StyledExplainer = styled.div`
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 50px;
  text-align: center;
`
const StyledIcon = styled(Icon)`
  font-size: 30px;

  path {
    fill: #4D00B4;
  }
`
const StyledCard = styled(Card)`
  background: #FFFFFF;
  box-shadow: 0px 6px 36px rgba(24, 0, 255, 0.25);
  border-radius: 12px;
  height: 240px;
  text-align: center;
  width: 95%;
`
const StyledCardText = styled.div`
  color: #4D00B4;
  font-size: 14px;
  line-height: 16px;
  margin-top: 15px;
  text-align: center;
`

const Crowdfunding = ({ lists, session, disputeID }) => {
  const { drizzle, useCacheCall, useCacheEvents } = useDrizzle()

  const numberOfRounds = useCacheCall('KlerosGovernor', 'getSessionRoundsNumber', session)
  const crowdFundingRoundInfo = numberOfRounds && useCacheCall('KlerosGovernor', 'getRoundInfo', session, numberOfRounds)
  const dispute = useCacheCall('KlerosLiquid', 'disputes', disputeID)
  const currentRuling = useCacheCall('KlerosLiquid', 'currentRuling', disputeID)

  console.log(dispute)

  return (
    <StyledContainer>
        {
          dispute && Number(dispute.period) === 0 ? (
            <div>
              <StyledHeader>Crowdfunding Appeal Fees</StyledHeader>
              <StyledExplainer>The appeal fees are in crowdfunding. The case will be sent to the jurors when the crowdfunding is completed. <br /><br /> Anyone can contribute to appeal crowdfunding and win rewards. Note that help funding the dispute can make you win rewards, if the side you contributed won. </StyledExplainer>
              <Row>
                {
                  crowdFundingRoundInfo && lists.map((list, i) => (
                    <Col lg={8}>
                      <CrowdfundingCard list={list} isFunded={crowdFundingRoundInfo.hasPaid[i]} currentAmount={crowdFundingRoundInfo.paidFees[i]} winner={Number(currentRuling) - 1 === i}/>
                    </Col>
                  ))
                }
                <Col lg={8}>
                  <StyledCard>
                    <StyledIcon type="warning" theme="filled" />
                    <StyledCardText>If the loser complete it’s appeal funding, the winner of the previous round should also fully fund the appeal, in order not to lose the case. </StyledCardText>
                  </StyledCard>
                </Col>
              </Row>
              <Button>Contribute to fees</Button>
            </div>
          ) : (
            <div>
              <StyledHeader>Dispute in Progress</StyledHeader>
            </div>
          )
        }

    </StyledContainer>
  )
}

export default Crowdfunding

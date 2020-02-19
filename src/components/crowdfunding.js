import { Card, Row, Col, Icon, Button } from 'antd'
import React, { useState } from 'react'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'
import styled from 'styled-components'
import { toBN } from "web3-utils"

import CrowdfundingCard from '../components/crowdfunding-card'
import CrowdfundingModal from '../components/crowdfunding-modal'

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
const StyledButton = styled(Button)`
  border-radius: 3px;
  background: #009aff;
  border: 1px solid #009aff;
  color: white;
  float: right;

  &:hover {
    background: #009aff;
    color: #fff;
  }
`

const Crowdfunding = ({ lists, session, disputeID }) => {
  const { drizzle, useCacheCall, useCacheEvents } = useDrizzle()
  const [ showModal, setShowModal ] = useState(false)

  const numberOfRounds = useCacheCall('KlerosGovernor', 'getSessionRoundsNumber', session)
  const crowdFundingRoundInfo = numberOfRounds && useCacheCall('KlerosGovernor', 'getRoundInfo', session, numberOfRounds)
  const dispute = useCacheCall('KlerosLiquid', 'disputes', disputeID)
  const currentRuling = useCacheCall('KlerosLiquid', 'currentRuling', disputeID)

  // Appeal fee
  const arbitratorExtraData = useCacheCall('KlerosGovernor', 'arbitratorExtraData')
  const winnerMultiplier = useCacheCall('KlerosGovernor', 'winnerMultiplier')
  const sharedMultiplier = useCacheCall('KlerosGovernor', 'sharedMultiplier')
  const loserMultiplier = useCacheCall('KlerosGovernor', 'loserMultiplier')
  const MULTIPLIER_DIVISOR = useCacheCall('KlerosGovernor', 'MULTIPLIER_DIVISOR')
  const appealFee = arbitratorExtraData && useCacheCall('KlerosLiquid', 'appealCost', disputeID, arbitratorExtraData)
  // uint totalCost = appealCost.addCap((appealCost.mulCap(multiplier)) / MULTIPLIER_DIVISOR);
  const appealTimes = useCacheCall('KlerosLiquid', 'appealPeriod', disputeID)

  const now = parseInt((new Date()).getTime() / 1000)
  const winnerDeadline = appealTimes && new Date(Number(appealTimes.end) * 1000)
  const loserDeadline = appealTimes && new Date(Number(appealTimes.end - ((Number(appealTimes.end) - Number(appealTimes.start)) / 2)) * 1000)

  return (
    <StyledContainer>
        {
          dispute && Number(dispute.period) === 3 ? (
            <div>
              <StyledHeader>Crowdfunding Appeal Fees</StyledHeader>
              <StyledExplainer>The appeal fees are in crowdfunding. The case will be sent to the jurors when the crowdfunding is completed. <br /><br /> Anyone can contribute to appeal crowdfunding and win rewards. Note that help funding the dispute can make you win rewards, if the side you contributed won. </StyledExplainer>
              <Row>
                {
                  appealFee &&
                  winnerMultiplier &&
                  sharedMultiplier &&
                  loserMultiplier &&
                  crowdFundingRoundInfo &&
                  MULTIPLIER_DIVISOR &&
                  lists.map((list, i) => (
                    <Col lg={8} key={i} >
                      <CrowdfundingCard
                        list={list}
                        isFunded={crowdFundingRoundInfo.hasPaid[i]}
                        currentAmount={crowdFundingRoundInfo.paidFees[i]}
                        totalFee={
                          Number(currentRuling) - 1 === i ? (
                            toBN(appealFee).add(toBN(appealFee).mul(toBN(winnerMultiplier))).div(toBN(MULTIPLIER_DIVISOR))
                          ) : (
                            Number(currentRuling) === 0 ? (
                              toBN(appealFee).add(toBN(appealFee).mul(toBN(sharedMultiplier))).div(toBN(MULTIPLIER_DIVISOR))
                            ) : (
                              toBN(appealFee).add(toBN(appealFee).mul(toBN(loserMultiplier))).div(toBN(MULTIPLIER_DIVISOR))
                            )
                          )
                        }
                      winner={Number(currentRuling) - 1 === i}
                      winnerMultiplier={winnerMultiplier}
                      loserMultiplier={loserMultiplier}
                      winnerDeadline={winnerDeadline}
                      loserDeadline={loserDeadline}
                      />
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
              <StyledButton onClick={() => {setShowModal(true)}}>Contribute to fees</StyledButton>
              {
                showModal ? (
                  <CrowdfundingModal onCancel={() => {setShowModal(false)}} lists={lists} currentRuling={currentRuling} winnerDeadline={winnerDeadline} loserDeadline={loserDeadline} />
                ) : ''
              }

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

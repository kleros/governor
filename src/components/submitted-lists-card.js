import { Col, Row, Card } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useDrizzle, useDrizzleState } from '../bootstrap/drizzle-react-hooks'
import { ReactComponent as Hexagon } from '../assets/images/hexagon.svg'
import { ReactComponent as LightPurpleArrowBackground } from '../assets/images/light-bg-arrow.svg'
import { ReactComponent as PurpleArrowBackground } from '../assets/images/dark-bg-arrow.svg'

const StyledCard = styled(Card)`
  background: #FFFFFF;
  box-shadow: 0px 6px 36px #BC9CFF;
  border-radius: 12px;
  min-height: 120px;
`
const StyledPurpleCol = styled(Col)`
  background: linear-gradient(141.4deg, #4D00B4 46.25%, #6500B4 96.25%);
  margin: -24px 0px -24px -32px;
  padding: 24px 32px;
`
const StyledLightPurpleArrowBackground = styled(LightPurpleArrowBackground)`
  height: 122px;
  position: absolute;
  right: -35px;
  top: -24px;
  z-index: 0;

  @media (max-width: 991px) {
    display: none;
  }
`
const StyledHexagon = styled(Hexagon)`
  height: 100px;
  position: absolute;
  top: 11px;
  left: 20px;
  width: auto;

  path {
    fill: #1E075F;
  }
`
const StyledPrefixDiv = styled.div`
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  left: 65px;
  position: absolute;
  top: 58px;
  transform: translate(-50%, -50%);
`
const SubmittedListsTextContainer = styled.div`
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  margin-left: 110px;
`
const SubmittedListsTextLarge = styled.div`
  font-size: 36px;
  line-height: 42px;
`
const HowItWorksText = styled.div`
  color: #4004A3;
  font-size: 14px;
  line-height: 16px;
`

const SubmittedListsCard = () => {
  // Import our Drizzle cache loader
  const { useCacheCall } = useDrizzle()

  // Fetch session number from the contract. Between calls, as long as there is no update to the contract, the value will be cached. As we need to make 2 contracts calls to fetch this data point, pass in a callback.
  // NOTE: As this uses React Hooks you can think of numberOfLists (as well as _currentSessionNumber and _numberOfLists) as a state variables. It will initially be undefined as the call gets executed async. Once the value is returned the component will rerender.
  const numberOfLists = useCacheCall(
    ['KlerosGovernor'],
    call => {
      const _currentSessionNumber = call(
        'KlerosGovernor',
        'getCurrentSessionNumber'
      )

      // Need to make sure it's undefined, 0 === !_currentSessionNumber.
      if (typeof _currentSessionNumber !== 'undefined') {
        const _sessionLists =  call(
          'KlerosGovernor',
          'getSubmittedLists',
          _currentSessionNumber
        )

        if (_sessionLists) return _sessionLists.length
      }
    }
  )

  return (
    <StyledCard>
      <Row>
        <StyledPurpleCol lg={6}>
          <StyledHexagon />
          <StyledPrefixDiv>{numberOfLists}</StyledPrefixDiv>
          <SubmittedListsTextContainer>
            <div>Submitted</div>
            <SubmittedListsTextLarge>Lists</SubmittedListsTextLarge>
            <div>this week</div>
          </SubmittedListsTextContainer>
        </StyledPurpleCol>
        <Col lg={12}>
          <HowItWorksText>
            How it works: Every week, if there is only one list of TXs, this list gets executed. If there are more, a dispute is created. The TXs of winning list are executed and its submitter gets the deposit of the parties who made different submissions minus arbitration fees. If the winning list had duplicates, the first submitter gets the reward.
          </HowItWorksText>
        </Col>
        <Col lg={5}>
        </Col>
        <StyledLightPurpleArrowBackground />
      </Row>
    </StyledCard>
  )
}

export default SubmittedListsCard

import { Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'
import { ReactComponent as Hexagon } from '../assets/images/hexagon.svg'
import TimeAgo from './time-ago'

const StyledContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 6px 36px #bc9cff;
  min-height: 120px;
`
const StyledCols = styled(Col)`
  min-height: 120px;
  padding: 10px 0px;
`
const StyledPurpleCol = styled(StyledCols)`
  background: linear-gradient(141.4deg, #4d00b4 46.25%, #6500b4 96.25%);
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
`
const StyledCenterCol = styled(StyledCols)`
  padding: 20px 20px;

  @media (max-width: 1105px) {
    padding: 8px 18px;
  }
`
const StyledLightPurpleCol = styled(StyledCols)`
  background: #f5f1fd;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
`
const StyledHexagon = styled(Hexagon)`
  height: 100px;
  left: 20px;
  position: absolute;
  top: 11px;
  width: auto;

  path {
    fill: #1e075f;
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
  margin-left: 115px;
  padding: 10px 5px;
`
const SubmittedListsTextLarge = styled.div`
  font-size: 36px;
  line-height: 42px;
`
const HowItWorksText = styled.div`
  color: #4004a3;
  font-size: 14px;
  line-height: 16px;
`
const StyledTimeout = styled.div`
  color: #4d00b4;
  font-weight: 600;
  padding: 25px 0px;
  text-align: center;
`
const StyledTimeAgo = styled(TimeAgo)`
  font-size: 18px;
`

const SubmittedListsCard = ({ status }) => {
  // Import our Drizzle cache loader
  const { useCacheCall } = useDrizzle()

  // Fetch session number from the contract. Between calls, as long as there is no update to the contract, the value will be cached. As we need to make 2 contracts calls to fetch this data point, pass in a callback.
  // NOTE: As this uses React Hooks you can think of numberOfLists (as well as _currentSessionNumber and _numberOfLists) as a state variables. It will initially be undefined as the call gets executed async. Once the value is returned the component will rerender.
  const numberOfLists = useCacheCall(['KlerosGovernor'], call => {
    const _currentSessionNumber = call(
      'KlerosGovernor',
      'getCurrentSessionNumber'
    )

    // Need to make sure it's undefined, 0 === !_currentSessionNumber.
    if (typeof _currentSessionNumber !== 'undefined') {
      const _sessionLists = call(
        'KlerosGovernor',
        'getSubmittedLists',
        _currentSessionNumber
      )

      if (_sessionLists) return _sessionLists.length
    }
  })

  const lastApprovalTime = useCacheCall('KlerosGovernor', 'lastApprovalTime')

  const submissionTimeout = useCacheCall('KlerosGovernor', 'submissionTimeout')

  let timeout
  if (lastApprovalTime && submissionTimeout)
    timeout = new Date(
      (Number(lastApprovalTime) + Number(submissionTimeout)) * 1000
    )

  return (
    <StyledContainer>
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
        <StyledCenterCol lg={12}>
          <HowItWorksText>
            How it works: Every week, if there is only one list of TXs, this
            list gets executed. If there are more, a dispute is created. The TXs
            of winning list are executed and its submitter gets the deposit of
            the parties who made different submissions minus arbitration fees.
          </HowItWorksText>
        </StyledCenterCol>
        <StyledLightPurpleCol lg={6}>
          {
            Number(status) === 0 ? (
              <StyledTimeout>
                <div>List submission</div>
                <StyledTimeAgo>{timeout}</StyledTimeAgo>
              </StyledTimeout>
            ) : Number(status) === 1 ? (
              <StyledTimeout>
                <div>Dispute Ongoing</div>
              </StyledTimeout>
            ) : ''
          }
        </StyledLightPurpleCol>
      </Row>
    </StyledContainer>
  )
}

export default SubmittedListsCard

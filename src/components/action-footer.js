import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 24px;
  margin-top: 25px;
  padding: 34px 10px;
`
const StyledActionsDiv = styled(StyledDiv)`
  background: linear-gradient(63.12deg, #1E075F 29.65%, #4D00B4 76.51%);
  box-shadow: 0px 6px 36px #BC9CFF;
  min-height: 250px;
  overflow: hidden;
`
const StyledHeading = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
`
const StyledSubtext = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  margin-top: 25px;
  text-align: center;
`
const StyledButton = styled(Button)`
  border-radius: 3px;
  position: relative;
  margin-top: 60px;
  width: 20%;
`

const ActionFooter = ({ action, buttonText, heading, subtext, tertiaryText, disabled }) => {
  return (
    <StyledActionsDiv>
      <StyledHeading>
        { heading }
      </StyledHeading>
      <StyledSubtext>
        { subtext }
      </StyledSubtext>
      <StyledSubtext>
        { tertiaryText }
      </StyledSubtext>
      { action ? (
        <StyledButton onClick={action} type="primary" disabled={disabled}>
          {buttonText}
        </StyledButton>
      ) : ''}
    </StyledActionsDiv>
  )
}

export default ActionFooter

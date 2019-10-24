import { Radio } from 'antd'
import React from 'react'
import styled from 'styled-components'

import TopBanner from '../components/top-banner'
import List from '../components/list'
import ActionFooter from '../components/action-footer'

const StyledRadioGroup = styled(Radio.Group)`
  float: right;

  .ant-radio-button-wrapper {
    border: 1px solid #4d00b4 !important;
    border-radius: 300px;
    color: #4d00b4;
    margin-left: 10px;

    &:before {
      background-color: transparent;
    }

    &-checked {
      background: #4d00b4 !important;
    }
  }
`

const MyLists = () => {
  const myLists = [{}]

  return (
    <>
      <TopBanner
        description="These are your proposed lists to be executed."
        title="My Lists"
        extra={(
          <StyledRadioGroup
            buttonStyle="solid"
            name="filter"
            onChange={() => {}}
          >
            <Radio.Button value={0}>Open Lists</Radio.Button>
            <Radio.Button value={1}>In Dispute</Radio.Button>
            <Radio.Button value={2}>Executed</Radio.Button>
          </StyledRadioGroup>
        )}
      />
      {
        myLists.map(l => (
          <>
            <List />
            <ActionFooter
              action={() => {}}
              buttonText={'Withdraw List'}
              heading={'The list was submitted'}
              subtext={'After submitting the list you have 1 hour to withdraw it if you notice someone has already posted a similar list. This way you can avoid getting into a dispute.'}
              tertiaryText={'00h 59m 30s'}
            />
          </>
        ))
      }
    </>
  )
}

export default MyLists

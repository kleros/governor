import { Button } from 'antd'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import TopBanner from '../components/top-banner'
import SubmittedListsCard from '../components/submitted-lists-card'

const StyledButton = styled(Button)`
  box-shadow: none;
  float: right;
  text-shadow: none;
`

class Home extends PureComponent {
  render() {
    return (
      <>
        <TopBanner
          description="Submit a list of decisions to be executed"
          extra={
            <Link to="/">
              <StyledButton
                size="large"
                style={{ maxWidth: '150px' }}
                type="primary"
              >
                Create New List
              </StyledButton>
            </Link>
          }
          title="Welcome to Kleros Governor"
        />
        <SubmittedListsCard />
      </>
    )
  }
}

export default Home

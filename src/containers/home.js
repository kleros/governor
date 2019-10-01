import { Button } from 'antd'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import TopBanner from '../components/top-banner'
import SubmittedListsCard from '../components/submitted-lists-card'
import List from '../components/list'

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
                <Link to="/new-list">Create New List</Link>
              </StyledButton>
            </Link>
          }
          title="Welcome to Kleros Governor"
        />
        <SubmittedListsCard />
        <List />
      </>
    )
  }
}

export default Home

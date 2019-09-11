import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import TopBanner from '../components/top-banner'

const StyledButton = styled(Button)`
  box-shadow: none;
  float: right;
  text-shadow: none;
`
export default () => (
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
  </>
)

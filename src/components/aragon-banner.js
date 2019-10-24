import { Row, Col, Button } from 'antd'
import React from 'react'
import styled from 'styled-components'

import AragonLogo from '../assets/images/aragon-logo.png'

const AragonBannerContainer = styled.div`
  border-radius: 12px;
  box-shadow: 0px 6px 36px #BC9CFF;
  color: #4D00B4;
  margin-bottom: 25px;
  min-height: 82px;
`
const AragonBannerLeft = styled(Col)`
  background: #fff;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  font-size: 24px;
  line-height: 24px;
  min-height: 82px;
  padding: 26px 44px;
`
const AragonBannerRight = styled(Col)`
  background: #F5F1FD;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  min-height: 82px;
  position: relative;
`
const AragonButton = styled(Button)`
  color: #4D00B4;
  border: 1px solid #4D00B4;
  padding: 5px 20px;
`
const AragonLogoImg = styled.img`
  margin-left: 30%;
  margin-top: 10px;
`

const AragonBanner = ({}) => {
  return (
    <AragonBannerContainer>
      <Row>
        <AragonBannerLeft lg={20}>
          <Row>
            <Col lg={22}>
              <span>You can find the decisions on <b>Aragon Governance Kleros</b></span>
            </Col>
            <Col lg={2}>
              <AragonButton><a href="https://governance.kleros.io">Go There</a></AragonButton>
            </Col>
          </Row>
        </AragonBannerLeft>
        <AragonBannerRight lg={4}>
          <AragonLogoImg src={AragonLogo} />
        </AragonBannerRight>
      </Row>
    </AragonBannerContainer>
  )
}

export default AragonBanner

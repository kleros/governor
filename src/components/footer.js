import { Col, Row } from 'antd'
import { ReactComponent as Ghost } from '../assets/images/ghost.svg'
import { ReactComponent as Github } from '../assets/images/github.svg'
import { ReactComponent as LinkedIn } from '../assets/images/linkedin.svg'
import { ReactComponent as Question } from '../assets/images/question-circle.svg'
import { ReactComponent as Telegram } from '../assets/images/telegram.svg'
import { ReactComponent as Twitter } from '../assets/images/twitter.svg'
import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled(Row)`
  background: #4d00b4;
  color: white;
  font-size: 14px;
  height: 60px;
  margin-top: -60px;
  padding: 18px 25px;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    color: white;
    text-decoration: none;
  }
`
const StyledLeft = styled(Col)`
  display: inline-block;
  text-align: left;
  width: 33%;
`
const StyledCenter = styled(Col)`
  display: inline-block;
  text-align: center;
  width: 33%;
`
const StyledRight = styled(Col)`
  display: inline-block;

  .help {
    display: inline-block;

    @media (max-width: 1130px) {
      width: 100%;
    }

    &-text {
      display: inline-block;
      padding-right: 10px;
    }

    &-icon {
      position: relative;
      top: 4px;
      width: 18px;
    }
  }

  .icons {
    display: inline-block;
    position: relative;
    top: 3px;

    @media (max-width: 1130px) {
      display: none;
    }

    a {
      padding-right: 10px;
    }
  }
`

const Footer = () => (
  <StyledFooter>
    <StyledLeft lg={4}>
      <a href="https://kleros.io">Find out more about Kleros</a>
    </StyledLeft>
    <StyledCenter lg={16}>Kleros Governor</StyledCenter>
    <StyledRight lg={8}>
      <Row>
        <Col className="help" lg={8} offset={4}>
          <a href="https://t.me/kleros">
            <div className="help-text">I need help</div>
            <Question className="help-icon" />
          </a>
        </Col>
        <Col className="icons" lg={12}>
          <a
            href="https://twitter.com/kleros_io?"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Twitter />
          </a>
          <a
            href="https://github.com/kleros"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github />
          </a>
          <a
            href="https://blog.kleros.io/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Ghost />
          </a>
          <a
            href="https://www.linkedin.com/company/kleros/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <LinkedIn />
          </a>
          <a
            href="https://t.me/kleros"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Telegram />
          </a>
        </Col>
      </Row>
    </StyledRight>
  </StyledFooter>
)

export default Footer

import { Button, Card, Row, Col, Form, Input } from 'antd'
import React from 'react'
import styled from 'styled-components'

const BackgrounCard = styled(Card)`
  background: linear-gradient(101.5deg, #4D00B4 47.51%, #6501B4 95.02%);
  box-shadow: 0px 6px 36px #BC9CFF;
  border-radius: 12px;
`
const Heading = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  margin-bottom: 20px;
  text-align: center;
`
const SubText = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
`
const StyledButton = styled(Button)`
  border-radius: 3px;
  position: relative;
  margin-top: 95px;
  width: 100%;
`
const StyledInput = styled(Input)`
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 3px;
  color: #fff;
  padding: 12px;

  ::placeholder {
    color: #fff
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
  }
`

const AddTx = Form.create()(({ form }) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault()
      }}
    >
      <BackgrounCard>
        <Row>
          <Col lg={8}>
            <Heading>Add a TX to the List</Heading>
            <SubText>Include the action title and the TX=(to address,amount(eth),data) then click on Add TX to include it to the list below.</SubText>
            <StyledButton
              htmlType="submit"
              type="primary"
            >
              Add TX
            </StyledButton>
          </Col>
          <Col lg={15} offset={1}>
            <Form.Item>
              <StyledInput type="text" placeholder={'Action Title'} />
            </Form.Item>
            <Form.Item>
              <StyledInput type="text" placeholder={'To Address'} />
            </Form.Item>
            <Form.Item>
              <StyledInput type="text" placeholder={'Amount (ETH)'} />
            </Form.Item>
            <Form.Item>
              <StyledInput type="text" placeholder={'Data'} />
            </Form.Item>
          </Col>
        </Row>
      </BackgrounCard>
    </Form>

  )
})

export default AddTx

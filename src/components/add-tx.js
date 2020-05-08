import { Button, Card, Row, Col, Form, Input, InputNumber } from 'antd'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

import { useDrizzle, useDrizzleState } from '../bootstrap/drizzle-react-hooks'
import { orderParametersByHash } from '../utils/tx-hash'

import List from './list'
import ActionFooter from './action-footer'
import ETHAmount from './eth-amount'

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
const StyledTextArea = styled(Input.TextArea)`
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #fff;

  ::placeholder {
    color: #fff
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
  }
`
const StyledInputNumber = styled(InputNumber)`
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 3px;
  color: #fff;
  width: 100%;

  input::placeholder {
    color: #fff
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
  }
`

const AddTx = Form.create()(({ form }) => {
  const [txs, setTxs] = useState([])
  const { drizzle, useCacheCall, useCacheSend } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    balance: drizzle.web3.utils.toBN(
      drizzleState.accountBalances[drizzleState.accounts[0]]
    )
  }))
  const { send, status } = useCacheSend('KlerosGovernor', 'submitList')

  const costPerTx = useCacheCall('KlerosGovernor', 'submissionBaseDeposit')

  const addTXtoSet = () => {
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const _newValues = {
          ...values
        }
        _newValues.amount = drizzle.web3.utils.toWei(String(Number(_newValues.amount)))
        txs.push(_newValues)
        setTxs(
          txs
        )

        // Reset fields so they can add a new tx
        form.resetFields()
      }
    })
  }

  const submitTxSet = () => {
    if (txs.length > 0) {
      const { addresses, values, data, dataSizes, titles } = orderParametersByHash(txs)

      send(addresses, values, data, dataSizes, titles, {
        value: costPerTx
      })
    } else {
      send([], [], '0x', [], '', {
        value: costPerTx
      })
    }
  }

  return (
    <Form
      onSubmit={e => {
        e.preventDefault()
        addTXtoSet()
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
            <Form.Item hasFeedback >
              {form.getFieldDecorator('title', {
                rules: [
                  {
                    message: "Title too short",
                    validator: (_, _value, callback) => {
                      if (!_value || _value.length < 7)
                        return callback(true)
                      callback()
                    }
                  }
                ]
              })(
                <StyledInput type="text" placeholder={'Action Title'} />
              )}
            </Form.Item>
            <Form.Item hasFeedback>
              {form.getFieldDecorator('address', {
                rules: [
                  {
                    message: "Invalid address",
                    validator: (_, _value, callback) => {
                      if (!drizzle.web3.utils.isAddress(_value))
                        return callback(true)
                      callback()
                    }
                  }
                ]
              })(
                <StyledInput type="text" placeholder={'To Address'} />
              )}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('amount', {
                rules: [
                  {
                    message: "Amount must be positive.",
                    validator: (_, _value, callback) => {
                      if (_value === undefined || _value === '' || _value === '-' || _value === '.')
                        return callback(true)
                      const value = drizzle.web3.utils.toBN(
                        drizzle.web3.utils.toWei(
                          typeof _value === 'number'
                            ? _value.toLocaleString('fullwide', {
                                useGrouping: false
                              })
                            : typeof _value === 'string'
                            ? _value
                            : String(_value)
                        )
                      )
                      callback(
                        value.gte(drizzle.web3.utils.toBN(0)) ? undefined : true
                      )
                    }
                  },
                  {
                    message: "You don't have enough ETH.",
                    validator: (_, _value, callback) => {
                      if (_value === undefined || _value === '' || _value === '-' || _value === '.')
                        return callback()
                      const value = drizzle.web3.utils.toBN(drizzle.web3.utils.toWei(String(Number(_value))))
                      callback(
                        !value || value.lte(drizzleState.balance)
                          ? undefined
                          : true
                      )
                    }
                  },
                ]
              })(
                <StyledInputNumber
                  type="text"
                  placeholder={'Amount (ETH)'}
                  parser={useCallback(s => {
                    s = s.replace(/(?!^-|\.)\D|\.(?![^.]*$)/g, '')
                    const index = s.indexOf('.')
                    return index === -1
                      ? s
                      : `${s.slice(0, index)}${s.slice(index, index + 19)}`
                  }, [])}
                />
              )}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('data', {
                rules: [
                  {
                    message: "Data required (use 0x for no data)",
                    validator: (_, _value, callback) => {
                      if (!_value || _value.length < 1)
                        return callback(true)
                      callback()
                    }
                  }
                ]
              })(
                <StyledTextArea type="text" placeholder={'Data'} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </BackgrounCard>
      {
        txs.length > 0 ? (
          <List txs={txs} number={1}/>
        ) : ''
      }
      <ActionFooter
        action={(e)=>{
          e.preventDefault()
          submitTxSet()
        }}
        buttonText={'Submit List'}
        heading={'Submit the list of governance decisions to be executed'}
        subtext={'After submitting the list you have 1 hour to withdraw it if you notice someone has already posted a similar list. This way you can avoid getting into a dispute.'}
        tertiaryText={
          <>
            Deposit required = <ETHAmount amount={(costPerTx || 0)} decimals={2} /> ETH
          </>
      }
      />
    </Form>
  )
})

export default AddTx

import {
  Col,
  Form,
  Icon,
  InputNumber,
  Modal,
  Row,
  Skeleton,
  Radio
} from 'antd'
import React, { useCallback, useMemo } from 'react'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'
import styled from 'styled-components'
import TimeAgo from './time-ago'

const StyledModal = styled(Modal)`
  max-width: 90%;

  h2 {
    font-size: 18px;
    line-height: 21px;
    text-align: center;

    color: #4D00B4;
  }

  .ant-modal {
    &-content {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    &-body {
      padding: 35px 41px;
    }

    &-header {
      background: #4d00b4;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      height: 55px;
      text-align: center;
    }

    &-title {
      color: white;
      font-size: 18px;
    }

    &-footer {
      border: none;
      padding: 0px 41px 35px 41px;

      div {
        display: flex;
        justify-content: space-between;
      }

      button {
        font-size: 14px;
        height: 40px;
        min-width: 110px;
      }

      .ant-btn {
        background: none;
        border: 1px solid #4d00b4;
        border-radius: 3px;
        color: #4d00b4;

        &-primary {
          background: #009aff;
          border: 1px solid #009aff;
          color: white;
        }

        &-primary:disabled {
          background: grey;
        }
      }
    }
  }
`
const StyledForm = styled(Form)`
  .ant-form-item {
    &-label {
      line-height: 30px;

      label {
        color: #4d00b4 !important;
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
      }
    }

    .ant-input-number {
      height: 40px;

      input {
        border: 1px solid #d09cff;
        border-radius: 3px;
        box-sizing: border-box;
        color: #4d00b4;
        font-size: 18px;
        font-weight: 500;
        height: 40px;
        line-height: 21px;
      }
    }

    .ant-form-extra {
      color: #4d00b4;
      font-size: 12px;
      font-style: italic;
      line-height: 14px;
    }

    .agreement-text {
      color: #4d00b4;
      font-size: 14px;
      line-height: 16px;
      padding-left: 12px;
    }
    .agreement-checkbox {
      line-height: 16px;
    }
  }
`
const StyledInputNumber = styled(InputNumber)`
  width: 100%;
`
const StyledRow = styled(Row)`
  border-bottom: 1px solid #D09CFF;
  font-weight: 600;
  padding: 0px 23px 15px 23px;
  margin-bottom: 15px;
  margin-left: -41px;
  margin-right: -41px;
`
const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
`
const StyledText = styled.div`
  font-size: 14px;
  line-height: 18px;
`
const StyledSubtext = styled.div`
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
`
const Deadline = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: #F60C36;
  font-weight: 400;
`

const RadioItem = ({ list, winner, winnerDeadline, loserDeadline }) => {
  return (
    <StyledRow>
      <Col lg={10} offset={1}>
        <StyledText>List {list.listID}</StyledText>
        <StyledSubtext>Previous Round { winner ? 'Winner' : 'Loser'}</StyledSubtext>
      </Col>
      <Col lg={11}>
        <Deadline>
          <Row>
            <Col lg={2}>
              <Icon type="clock-circle" />
            </Col>
            {
              (winner ? winnerDeadline > new Date() : loserDeadline > new Date()) ? (
                <Col lg={21} offset={1}>
                  <span>{winner ? `Winner Deadline ` : `Loser Deadline `} <br/><TimeAgo>{winner ? winnerDeadline : loserDeadline}</TimeAgo></span>
                </Col>
              ) : (
                <Col lg={21} offset={1}>
                  <span>Deadline passed <br/><TimeAgo>{winner ? winnerDeadline : loserDeadline}</TimeAgo></span>
                </Col>
              )
            }

          </Row>
        </Deadline>
      </Col>
      <Col lg={2}>
        <Radio value={list.listID} disabled={new Date() > (winner ? winnerDeadline : loserDeadline)}/>
      </Col>
    </StyledRow>
  )
}

const CrowdfundingModal = Form.create()(({ ID, form, onCancel, lists, currentRuling, winnerDeadline, loserDeadline }) => {
  const { drizzle, useCacheSend } = useDrizzle()

  const loading=false
  const hasError = false
  const { send } = useCacheSend(
    'KlerosGovernor',
    'fundAppeal'
  )
  return (
    <StyledModal
      cancelText="Back"
      centered
      closable={false}
      confirmLoading={loading}
      maskClosable
      okButtonProps={useMemo(
        () => ({
          disabled: hasError,
          htmlType: 'submit'
        }),
        [hasError]
      )}
      onCancel={useCallback(() => onCancel(), [onCancel])}
      onOk={useCallback(
        () =>
          form.validateFieldsAndScroll((err, values) => {
            if (!err)
              send(values.listID, {
                value: drizzle.web3.utils.toWei(String(values.amount))
              })
          }),
        [form.validateFieldsAndScroll]
      )}
      title={`Contribute to Fees`}
      visible
      width="480px"
    >
    <StyledForm>
      <StyledRow>
        <h2>Which side do you want to fund?</h2>
      </StyledRow>
      <Form.Item>
          {form.getFieldDecorator('listID')(
            <StyledRadioGroup>
              {lists.map((list, i) => (
                <RadioItem key={i} list={list} winner={Number(currentRuling) - 1 === i} winnerDeadline={winnerDeadline} loserDeadline={loserDeadline} />
              ))}
            </StyledRadioGroup>
          )}
        </Form.Item>
        <h2>Contribution Amount</h2>
        <Skeleton active loading={loading}>
          {!loading && (
            <>
              <Form.Item
                colon={false}
                hasFeedback
              >
                {form.getFieldDecorator('amount', {
                  initialValue: drizzle.web3.utils.fromWei(String(0)),
                  rules: [
                    {
                      message: "You must contribute some ETH",
                      validator: (_, _value, callback) => {
                        if (_value === undefined || _value === '' || _value === '-')
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
                          value.gt(drizzle.web3.utils.toBN(0)) ? undefined : true
                        )
                      }
                    },
                  ]
                })(
                  <StyledInputNumber />
                )}
              </Form.Item>
            </>
          )}
        </Skeleton>
      </StyledForm>
    </StyledModal>
  )
})

export default CrowdfundingModal

import React, { useState } from 'react'
import styled from 'styled-components'

import { useDrizzle } from '../bootstrap/drizzle-react-hooks'

const TxCardContainer = styled.div`
  background: transparent;
  box-shadow: 0px 6px 36px #BC9CFF;
  color: #4D00B4;
  border-radius: 12px;
  margin-bottom: 14px;
  width: 95%;
`
const TxCardHeader = styled.div`
  background: #F5F1FD;
  padding: 13px 23px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`
const TxNumber = styled.div`
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 14px;
`
const TxTitle = styled.div`
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 14px;
`
const TxCardBody = styled.div`
  background: #fff;
  padding: 13px 23px;
  overflow-wrap: break-word;
  margin-bottom: 14px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`
const TxRemove = styled.div`
  position: absolute;
  right: 45px;
  top: 8px;
  cursor: pointer;
`
const ConvertText = styled.div`
  color: #A67FD9;
  cursor: pointer;
  font-style: italic;
  font-weight: 300;
  margin-top: 10px
`
const ConvertTextAnswer = styled.div`
  color: #A67FD9;
  font-style: italic;
  font-weight: 500;
  margin-top: 5px
`

const TxCard = ({ tx, number, onRemove }) => {
  const { drizzle } = useDrizzle()
  const [ error, setError ] = useState('')
  const [ methodCall, setMethodCall ] = useState('')

  const getMethodCallFromABI = async () => {
    if (!methodCall) {
      const network = await drizzle.web3.eth.net.getId()
      let uri
      switch (network) {
        case 1:
          uri = `https://api.etherscan.io/api?module=contract&action=getabi&address=${tx.address}`
          break
        case 42:
          uri = `https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=${tx.address}`
          break
        default:
          break
      }
      if (uri) {
        const abiQuery = await fetch(
          uri
        ).then(response => response.json())
        if (abiQuery.status === "1") {
          const abi = JSON.parse(abiQuery.result)
          let methodName
          let parameters = {}
          for (let i=0; i < abi.length; i++) {
            if (abi[i].name && !abi[i].constant) {
              const methodSig = drizzle.web3.eth.abi.encodeFunctionSignature(abi[i])
              if (tx.data.substring(0,10) === methodSig) {
                const _parameters = abi[i].inputs.length ? drizzle.web3.eth.abi.decodeParameters(abi[i].inputs, tx.data.substring(10,tx.data.length)) : {}
                parameters = Object.keys(_parameters).splice(abi[i].inputs.length+1, abi[i].inputs.length*2).map(k => `${k}:${_parameters[k]}`)
                methodName = abi[i].name
                break
              }
            }
          }
          setMethodCall(`${methodName}(${parameters})`)
        } else {
          setError('No published ABI for Contract')
        }
      } else {
        setError('Unsupported Network -- Check you are on Mainnet')
      }
    }
  }


  return (
    <TxCardContainer>
      <TxCardHeader>
        <TxNumber>TX {number}</TxNumber>
        { onRemove ? (
          <TxRemove onClick={() => onRemove(number - 1)}>X</TxRemove>
        ) : ''}
        <TxTitle>
          { tx.title }
        </TxTitle>
      </TxCardHeader>
      <TxCardBody>
        { `Tx=(${tx.address},${tx.amount || tx.value},${tx.data})` }
        <ConvertText onClick={getMethodCallFromABI}>Decode Method Call</ConvertText>
        <ConvertTextAnswer>
          {
            methodCall ? methodCall : ''
          }
        </ConvertTextAnswer>
        <ConvertTextAnswer>
          {
            error ? error : ''
          }
        </ConvertTextAnswer>
      </TxCardBody>
    </TxCardContainer>
  )
}

export default TxCard

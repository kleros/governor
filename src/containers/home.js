import { Button } from 'antd'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import TopBanner from '../components/top-banner'
import SubmittedListsCard from '../components/submitted-lists-card'
import List from '../components/list'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'

const StyledButton = styled(Button)`
  box-shadow: none;
  float: right;
  text-shadow: none;
`

const Home = () => {
  const { drizzle, useCacheCall, useCacheEvents } = useDrizzle()

  const lists = useCacheCall(['KlerosGovernor'], call => {
    const _currentSessionNumber = call(
      'KlerosGovernor',
      'getCurrentSessionNumber'
    )
    // Need to make sure it's undefined, 0 === !_currentSessionNumber.
    if (typeof _currentSessionNumber !== 'undefined') {
      const _sessionLists = call(
        'KlerosGovernor',
        'getSubmittedLists',
        _currentSessionNumber
      )
      if (_sessionLists) {
        return _sessionLists.map(_listID => {
          const titlesEvent = useCacheEvents(
            'KlerosGovernor',
            'ListSubmitted',
            {
              filter: { _listID },
              fromBlock: 0
            }
          )
          const numberOfTxs = call(
            'KlerosGovernor',
            'getNumberOfTransactions',
            _listID
          )
          if (numberOfTxs && titlesEvent && titlesEvent.length > 0) {
            const titles = titlesEvent[0].returnValues._description.split(',')
            const submitter = titlesEvent[0].returnValues._submitter
            const txs = []
            for (let i=0; i < numberOfTxs; i++) {
              const txInfo = call(
                'KlerosGovernor',
                'getTransactionInfo',
                _listID,
                i
              )
              if (txInfo) {
                txs.push(
                  {
                    title: titles[i],
                    data: '0x' + (txInfo.data || ''),
                    address: txInfo.target,
                    value: txInfo.value
                  }
                )
              }
            }

            return {
              submitter,
              txs,
              listID: _listID
            }
          }
        })
      }
    }
  })

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
      {
        (lists && lists.length > 0 && lists[0]) ? (
          lists.map(list => list && (
            <List txs={list.txs} number={list.listID} submitter={list.submitter} />
          ))
        ) : ''
      }
    </>
  )
}

export default Home

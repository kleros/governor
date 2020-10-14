import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ActionFooter from '../components/action-footer'
import Crowdfunding from '../components/crowdfunding'
import TopBanner from '../components/top-banner'
import SnapshotBanner from '../components/snapshot-banner'
import SubmittedListsCard from '../components/submitted-lists-card'
import List from '../components/list'
import { useDrizzle } from '../bootstrap/drizzle-react-hooks'

const StyledButton = styled(Button)`
  box-shadow: none;
  float: right;
  text-shadow: none;
`

const Home = () => {
  const { useCacheCall, useCacheEvents } = useDrizzle()

  const currentSessionNumber = useCacheCall('KlerosGovernor', 'getCurrentSessionNumber')
  const session = currentSessionNumber && useCacheCall('KlerosGovernor', 'sessions', currentSessionNumber)
  const lists = currentSessionNumber && useCacheCall(['KlerosGovernor'], call => {
    // Need to make sure it's undefined, 0 === !_currentSessionNumber.
    if (typeof currentSessionNumber !== 'undefined') {
      const _sessionLists = call(
        'KlerosGovernor',
        'getSubmittedLists',
        currentSessionNumber
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
                    data: (txInfo.data || '0x'),
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

  const crowdfunding  = true

  return (
    <>
      <TopBanner
        description="Submit a list of decisions to be executed"
        extra={
          <div>
            <StyledButton
              size="large"
              style={{ maxWidth: '150px' }}
              type="primary"
            >
              <Link to="/new-list">Create New List</Link>
            </StyledButton>
          </div>
        }
        title="Welcome to Kleros Governor"
      />
      <SnapshotBanner />
      <SubmittedListsCard status={session ? session.status : 0} />
      {
        (lists && lists.length > 0 && lists[0]) ? (
          lists.map(list => list && (
            <List key={list.listID} txs={list.txs} number={list.listID} submitter={list.submitter} />
          ))
        ) : ''
      }
      {
        session && session.status === '1' ? crowdfunding ? (
          <Crowdfunding lists={lists} session={currentSessionNumber} disputeID={session.disputeID} />
        ) : (
          <ActionFooter
            heading={'This list is being evaluated by jurors'}
            subtext={`If the jurors approve your list you win the other parties deposit - arbitration fees. If the jurors approve other list, you lose your deposit. You will be informed of the result soon. `}
          />
        ) : ''
      }
    </>
  )
}

export default Home

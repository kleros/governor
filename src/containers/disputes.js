import { Radio } from 'antd'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import TopBanner from '../components/top-banner'
import List from '../components/list'
import ActionFooter from '../components/action-footer'
import { useDrizzle, useDrizzleState } from '../bootstrap/drizzle-react-hooks'
import TimeAgo from '../components/time-ago'

const StyledRadioGroup = styled(Radio.Group)`
  float: right;

  .ant-radio-button-wrapper {
    border: 1px solid #4d00b4 !important;
    border-radius: 300px;
    color: #4d00b4;
    margin-left: 10px;

    &:before {
      background-color: transparent;
    }

    &-checked {
      background: #4d00b4 !important;
    }
  }
`

const getTimeRemaining = (submittedAt, timeout) => {
  const now = new Date()

  const _timeout = new Date(
      (Number(submittedAt) + Number(timeout)) * 1000
    )

  if (now > _timeout) return 0
  else return _timeout
}

const MyLists = () => {
  const [tab, setTab] = useState('active')
  const { drizzle, useCacheCall, useCacheEvents, useCacheSend } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    account: drizzleState.accounts[0]
  }))
  const { send, status } = useCacheSend('KlerosGovernor', 'withdrawTransactionList')

  const lists = useCacheCall(['KlerosGovernor'], call => {
    const myListEvents = useCacheEvents(
      'KlerosGovernor',
      'ListSubmitted',
      useMemo(
        () => ({
          fromBlock: 0
        }),
        [drizzleState.account]
      )
    )

    if (myListEvents) {
      return myListEvents.map(listEvent => {
        const _listID = listEvent.returnValues._listID
        const _titles = listEvent.returnValues._description
        const _sessionID = listEvent.returnValues._session

        const numberOfTxs = call(
          'KlerosGovernor',
          'getNumberOfTransactions',
          _listID
        )
        const submission = call(
          'KlerosGovernor',
          'submissions',
          _listID
        )
        const session = call(
          'KlerosGovernor',
          'sessions',
          _sessionID
        )
        const sessionTxs = call(
          'KlerosGovernor',
          'getSubmittedLists',
          _sessionID
        )

        if (numberOfTxs && submission && session && sessionTxs) {
          const titles = _titles.split(',')
          const submitter = drizzleState.account
          const submittedAt = submission.submissionTime
          const approved = submission.approved
          const submissionID = sessionTxs.indexOf(_listID)

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
            submittedAt,
            approved,
            listID: _listID,
            ruling: session.ruling,
            disputeID: session.disputeID,
            status: session.status,
            session: _sessionID,
            submissionID,
            listHash: submission.listHash,
            withdrawn: (submissionID === -1)
          }
        }
      })
    }
  })

  const currentSessionNumber = useCacheCall('KlerosGovernor', 'getCurrentSessionNumber')
  const withdrawTimeout = useCacheCall('KlerosGovernor', 'withdrawTimeout')

  let filteredLists = {
    'active': [],
    'disputed': [],
    'closed': []
  }
  if (currentSessionNumber && lists) {
    lists.forEach(_list => {
      if (!_list) return
      if (Number(_list.session) === Number(currentSessionNumber) && Number(_list.status) === 0)
        filteredLists.active.push(_list)
      else if (Number(_list.status) === 1)
        filteredLists.disputed.push(_list)
      else
        filteredLists.closed.push(_list)
    })
  }

  return (
    <>
      <TopBanner
        description="These are the lists in disputes"
        title="Disputes"
      />
      {
        filteredLists && filteredLists['disputed'].map(l => l && !l.withdrawn && (
          <>
            <List txs={l.txs} number={l.listID} submitter={drizzleState.account} />
          </>
        ))
      }
      <ActionFooter
        heading={'This list is being evaluated by jurors'}
        subtext={`If the jurors approve your list you win the other parties deposit - arbitration fees. If the jurors approve other list, you lose your deposit. You will be informed of the result soon. `}
      />
    </>
  )
}

export default MyLists

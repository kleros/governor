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

  const myLists = useCacheCall(['KlerosGovernor'], call => {
    const myListEvents = useCacheEvents(
      'KlerosGovernor',
      'ListSubmitted',
      useMemo(
        () => ({
          filter: { _submitter: drizzleState.account },
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
  if (currentSessionNumber && myLists) {
    myLists.forEach(_list => {
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
        description="These are your proposed lists to be executed."
        title="My Lists"
        extra={(
          <StyledRadioGroup
            buttonStyle="solid"
            name="filter"
            value={tab}
            onChange={(e) => {setTab(e.target.value)}}
          >
            <Radio.Button value={'active'}>Open Lists</Radio.Button>
            <Radio.Button value={'disputed'}>In Dispute</Radio.Button>
            <Radio.Button value={'closed'}>Executed</Radio.Button>
          </StyledRadioGroup>
        )}
      />
      {
        filteredLists && filteredLists[tab].map(l => l && !l.withdrawn && (
          <>
            <List txs={l.txs} number={l.listID} submitter={drizzleState.account} />
            {
              tab === 'active' ?
                getTimeRemaining(l.submittedAt, withdrawTimeout || 0) ? (
                    <ActionFooter
                      action={(e) => {
                        e.preventDefault()
                        send(l.submissionID, l.listHash)
                      }}
                      buttonText={'Withdraw List'}
                      heading={'The list was submitted'}
                      subtext={`After submitting the list you have ${Number(withdrawTimeout) / 60} minutes to withdraw it if you notice someone has already posted a similar list. This way you can avoid getting into a dispute.`}
                      tertiaryText={(
                        <TimeAgo>{getTimeRemaining(l.submittedAt, withdrawTimeout || 0)}</TimeAgo>
                      )}
                    />
                ) : (
                  <ActionFooter
                    heading={'The list was submitted'}
                    subtext={`At the end of the week, if there is only one list of TXs, this list gets executed. If there are more, a dispute is created. The TXs of winning list are executed and its submitter gets the deposit of the parties who made different submissions minus arbitration fees. If the winning list had duplicates, the first submitter gets the reward.`}
                  />
                )
             :
              tab === 'disputed' ? (
                <ActionFooter
                  heading={'This list is being evaluated by jurors'}
                  subtext={`If the jurors approve your list you win the other parties deposit - arbitration fees. If the jurors approve other list, you lose your deposit. You will be informed of the result soon. `}
                />
              ) : (
                <div/>
              )
            }
          </>
        ))
      }
    </>
  )
}

export default MyLists

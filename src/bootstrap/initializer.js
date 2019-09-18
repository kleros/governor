import React, { Component, Children } from 'react'
import { drizzleConnect } from 'drizzle-react'

import _404 from '../containers/404'

class Loading extends Component {
  render() {
    if (this.props.web3.status === 'failed')
    {
      return(
        <_404 Web3={true} />
      )
    }

    if (this.props.drizzleStatus.initialized)
    {
      // Load the dapp.
      return Children.only(this.props.children)
    }

    return(
      // Display a loading indicator. TODO
      <div />
    )
  }
}

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    web3: state.web3
  }
}

export default drizzleConnect(Loading, mapStateToProps)

/*eslint-disable*/
import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class TokenMarket extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="TokenMarket">
        <div className="container">
          <h1> Your Tokens </h1>
          <p>Token Name: {this.props.tokenName}</p>
          <p>Token Symbol: {this.props.tokenSymbol}</p>
          <p>Total Supply: {this.props.tokenSupply}</p>
          <p>Your Account: {this.props.parentAddress}</p>
          <p>Your {this.props.tokenSymbol} holdings : {this.props.parentBalance}</p>
        </div>
      </div>
    );
  }
}

export default TokenMarket

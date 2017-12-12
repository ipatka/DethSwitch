import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class DeployedContracts extends Component {

  render() {
    // console.log(this.props);
    return (
      <div className="DeployedContracts">
        <div className='container'>
          <h1> Your Deployed DethSwitch Contracts</h1>
          <button onClick={this.props.updateContracts}>
          Get Contracts
          </button>
          <h3> As Parent </h3>
          {JSON.stringify(this.props.parentContracts)}
          <h3> As Heir </h3>
          {JSON.stringify(this.props.heirContracts)}
        </div>
      </div>
    );
  }
}

export default DeployedContracts

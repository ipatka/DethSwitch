import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class ApproveFunds extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contract: undefined,
      desiredFunds: undefined
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async approveFunds(funds){

    await this.props.ercinstance.approve(this.state.contract,this.state.desiredFunds,{from:this.props.parentAddress}).then((res) => {
      console.log(`Approved:`);
      console.log(res);
    })

    await this.props.ercinstance.allowance(this.props.parentAddress,this.state.contract,{from:this.props.parentAddress}).then((res) => {
      console.log(`Approved Value:`);
      console.log(res);
    })

    await this.props.mapParent(this.props.parentAddress,this.state.contract);

  }

  handleSubmit(e) {
    e.preventDefault();
    this.approveFunds(this.state.desiredFunds);
  }

  pickContract(e){
    this.setState({contract: e});
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
    // console.log(e.target.value);
  }

  render() {

    return (
        <div className="NewContract">
          <div className="container">
              <h1> As a Parent, Approve Funds to a DethSwitch Contract</h1>
              <p>Your Address (detected): {this.props.parentAddress}</p>
              <p>ERC20Token address (detected): {this.props.tokenAddress}</p>
              <h3> Pick your contract to Approve funds </h3>
              { this.props.parentContracts ?
                this.props.parentContracts.map((item, index) => (
                   <button onClick={(e) => this.pickContract(item)} key={index}>Parent Contract#{index}: {item}</button>
                )) : undefined}
              {this.state.contract ?
                <div>
                  <h3> Your Contract Information </h3>
                  <p> Contract Address: {this.state.contract}</p>
                  <p> Allowance: {this.state.desiredFunds}</p>

                </div>
                : undefined}
                <div className='list-item'>
                  <input name="desiredFunds" placeholder="desiredFunds" type="text" value={this.state.desiredFunds} onChange={this.handleChange} />
                </div>
              <div className='submission-forms'>
                <button onClick={this.handleSubmit}>Aprove Funds</button>
              </div>
        </div>
      </div>
    );
  }
}

export default ApproveFunds

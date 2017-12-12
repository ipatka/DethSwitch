import React, { Component } from 'react'
import DethSwitch from "../build/contracts/DethSwitch.json";

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class WithdrawFunds extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contract: undefined
    }

    // this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async withdrawFunds(){
    return this.props.web3.eth.contract(DethSwitch.abi).at(this.state.contract).withdraw(this.props.tokenAddress,{from: this.props.parentAddress},(err,res) => {
      console.log(err);
      console.log(res);
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.withdrawFunds(20);
  }

  async getAllowance(cont){
    // parent address here is the heir to the contracts
    var add = await this.props.mapParent[cont];
    console.log(this.props.mapParent[cont]);
    await this.props.ercinstance.allowance(add,cont,{from: add}).then((res) => {
      // console.log(`Approved Value:`);
      // console.log(res.c[0]);
      this.setState({allowedFunds: res.c[0]});
    })

  }

  async pickContract(e){
    // e.preventDefault();
    await this.setState({contract: e})
    await this.getAllowance(this.state.contract);
    ;
  }

  render() {
    console.log(this.props.mapParent);
    return (
        <div className="NewContract">
          <div className="container">
              <h1> As an Heir, Withdraw Funds From a DethSwitch Contract</h1>
              <p>Your Address (detected): {this.props.parentAddress}</p>
              <p>ERC20Token address (detected): {this.props.tokenAddress}</p>
              <h3> Pick your contract to withdraw funds </h3>
              { this.props.heirContracts ?
                this.props.heirContracts.map((item, index) => (
                   <button onClick={(e) => this.pickContract(item)} key={index}>Heir Contract#{index}: {item}</button>
                )) : undefined}
              {this.state.contract ?
                <div>
                  <h3> Your Contract Information </h3>
                  <p> Contract Address: {this.state.contract}</p>
                  <p> Allowance: {this.state.allowedFunds}</p>
                </div>
                : undefined}
              <div className='submission-forms'>
                <button onClick={this.withdrawFunds.bind(this)}>Withdraw</button>
              </div>
        </div>
      </div>
    );
  }
}

export default WithdrawFunds

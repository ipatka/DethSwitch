/*eslint-disable*/
import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import TokenMarket from './TokenMarket.js';
import NewContract from './NewContract.js';
import DeployedContracts from './DeployedContracts.js';
import WithdrawFunds from './WithdrawFunds.js';
import ApproveFunds from './ApproveFunds.js';

// Contracts

import DSF from '../build/contracts/DethSwitchFactory.json';
import AnyERC20Token from '../build/contracts/AnyERC20Token.json';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      testeinstance: undefined
    }
    this.getHeirContracts = this.getHeirContracts.bind(this);
    this.getParentContracts = this.getParentContracts.bind(this);
    this.updateContracts = this.updateContracts.bind(this);
    this.mapContractToParents = this.mapContractToParents.bind(this);
  }

  async updateContracts(){
    this.setState({parentContracts:[]})
    this.setState({heirContracts:[]})
    this.getParentAccount().then(async () => {
      await this.getHeirContracts();
      await this.getParentContracts();
    });
  }

  async instantiateDSFContract() {
    const contract = require('truffle-contract')
    const dethSwitchFactory = contract(DSF)
    dethSwitchFactory.setProvider(this.state.web3.currentProvider)

    let instance = await dethSwitchFactory.deployed();
    this.setState({dsfinstance:instance})

    this.getHeirContracts();
    this.getParentContracts();

  }

  async instantiateERCContract() {
    const contract = require('truffle-contract')
    const anyERC20Token = contract(AnyERC20Token)
    anyERC20Token.setProvider(this.state.web3.currentProvider)
    let instance = await anyERC20Token.deployed();
    this.setState({ercinstance:instance})

    let tokenAddress = await instance.address;
    this.setState({tokenAddress})

    let totalSupply = await instance.totalSupply.call()
    this.setState({tokenSupply: totalSupply.toNumber()});

    let tokenName = await instance.name.call()
    this.setState({tokenName: tokenName});

    let tokenSymbol = await instance.symbol.call()
    this.setState({tokenSymbol: tokenSymbol});

    let parentAddress = await this.state.parentAddress;
    return instance.balanceOf(parentAddress).then((results) => {
      this.setState({parentBalance: results.c[0]});
    })

  }

  async getParentContracts(){

    await this.getParentAccount();
    let instance = this.state.dsfinstance;
    let numberOfContracts = await instance.getNumberOfOwnedContracts.call();
    let ownContractsArray = [];
    for (var i = 0; i < numberOfContracts; i++) {
      var ctc = await instance.getOwnedContracts.call(i,{from:this.state.parentAddress});
      ownContractsArray.push(ctc);
      this.setState({parentContracts:ownContractsArray})
    }

    return this.state.parentContracts
  }

  async getHeirContracts(){
    await this.getParentAccount();
    let instance = this.state.dsfinstance;
    let heirContracts = await instance.getNumberOfHeirContracts.call({from:this.state.parentAddress});
    let heirContractsArray = [];
    for (var i = 0; i < heirContracts; i++) {
      var ctc = await instance.getHeirContracts.call(i,{from:this.state.parentAddress});
      heirContractsArray.push(ctc);
      this.setState({heirContracts:heirContractsArray})
    }

  }

 async getParentAccount(){
   this.state.web3.eth.getAccounts((err,res) => {
     this.setState({
       parentAddress: res[0]
     })
     return res[0];
   });
 }

 async mapContractToParents(parent,contract){
   var objParent = this.state.mapParent || {};
   objParent[contract] = parent;
   this.setState({mapParent: objParent});
   console.log(this.state.mapParent);
 }

 componentWillMount() {


    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      results.web3.eth.getAccounts((err,res) => {
        this.setState({
          parentAddress: res[0]
        })
      });

      this.setState({
        parentAddress: results.web3.eth.accounts[0]
      })

      this.instantiateDSFContract();
      this.instantiateERCContract();

    })

    .catch((e) => {
      console.log(e)
    })

  }


  async getOwnedContracts(){

    if (this.state.dsfinstance) {
      let myContracts;
      let numberOfContracts = await this.state.dsfinstance.getNumberOfOwnedContracts.call();
      for (var i = 0; i < numberOfContracts; i++) {
        var ctc = await this.state.dsfinstance.getOwnedContracts.call(i);
        myContracts.push(ctc);
      }
      this.setState({parentContracts:myContracts})
    }

  }

  render() {
    console.log(this.state.mapParent);
    return (
      <div className='container'>
        <div className="App">
              <TokenMarket
                web3={this.state.web3}
                tokenName={this.state.tokenName}
                tokenSymbol={this.state.tokenSymbol}
                tokenSupply={this.state.tokenSupply}
                parentAddress={this.state.parentAddress}
                parentBalance={this.state.parentBalance}
              />

              <NewContract
                web3={this.state.web3}
                dsfinstance={this.state.dsfinstance}
                parentAddress={this.state.parentAddress}
                ercinstance={this.state.ercinstance}
                parentContracts={this.state.parentContracts}
              />

              <DeployedContracts
                parentContracts={this.state.parentContracts}
                heirContracts={this.state.heirContracts}
                updateContracts={this.updateContracts}
              />

              <ApproveFunds
                web3={this.state.web3}
                tokenAddress={this.state.tokenAddress}
                dsfinstance={this.state.dsfinstance}
                ercinstance={this.state.ercinstance}
                parentAddress={this.state.parentAddress}
                parentContracts={this.state.parentContracts}
                heirContracts={this.state.heirContracts}
                mapParent={this.mapContractToParents}
              />

              <WithdrawFunds
                web3={this.state.web3}
                tokenAddress={this.state.tokenAddress}
                dsfinstance={this.state.dsfinstance}
                ercinstance={this.state.ercinstance}
                parentAddress={this.state.parentAddress}
                parentContracts={this.state.parentContracts}
                heirContracts={this.state.heirContracts}
                mapParent={this.state.mapParent}
              />

        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

/*

so for the user:
3. approve DethSwitch contract to send on behalf of parent
    -Get reference to ERC20token contract (has to accept arbitrary token address)
    - TokenInstance = ERC20Token.at(tokenAddress)
    - TokenInstance.approve(DethSwithAddress, amountOfTokens)
*/

class NewContract extends Component {
  constructor(props) {
    super(props)

    this.state = {
      heirAddress: undefined,
      heartBeatTimer: undefined,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async createNewDethSwitch(){
    await this.props.dsfinstance.newDethSwitch(this.state.heirAddress,'placeholder', this.state.heartBeatTimer, {from: this.props.parentAddress}).then((res) => {
      console.log(res);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.createNewDethSwitch();
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    return (
        <div className="NewContract">
          <div className="container">
              <h1> Create a New DethSwitch Contract</h1>
              <p>Parent Address (detected): {this.props.parentAddress}</p>
              <p>Heir Address: {this.state.heirAddress}</p>
              <p>Drop Dead Date: {this.state.heartBeatTimer}</p>
              <div className='submission-forms'>
                <form onSubmit={this.handleSubmit}>
                  <div className='list-item'>
                    <input name="heirAddress" placeholder="heir address" type="text" value={this.state.heirAddress} onChange={this.handleChange} />
                  </div>
                  <div className='list-item'>
                    <input name="heartBeatTimer" placeholder="days till expiration" type="text" value={this.state.heartBeatTimer} onChange={this.handleChange} />
                  </div>
                  <input type="submit" value="Submit" />
                </form>
                <div>
                  <h3> Contract Information </h3>
                  <p>Heir: {this.state.heirAddress} </p>
                  <p>Expiration: {this.state.heartBeatTimer} </p>
                </div>
              </div>
        </div>
      </div>
    );
  }
}

export default NewContract

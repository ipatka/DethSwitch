pragma solidity ^0.4.4;

contract ERC20Token {
    // function definition of generic ERC20 token
    // necessary for DethSwitch to be able to reference functions in another contract
    function transferFrom(address _from, address _to, uint _value) returns (bool success) {}
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {}
}

contract DethSwitch {
    
    // TODO: make DethSwitch contract factory
    // TODO: make mapping that stores token addresses, heirs and values
    // TODO: onlyParent modifier
    // TODO: onlyHeir modifier

    // Dame of this contract instance
    string public Name;

    // Store parents and heir
    struct Parent {
        address addr;
        bool alive;
    }

    Parent parent;
    address heir;

    modifier onlyParent() {
        require(msg.sender == parent.addr);
        _;
    }

    modifier onlyHeir() {
        require(msg.sender == heir);
        _;
    }

    modifier onlyIfDead() {
        require(parent.alive == false);
        _;
    }


    function DethSwitch(address _parent, address _heir, string _name) {
    // constructor
        parent.addr = _parent;
        // for debugging, parent always dead
        parent.alive = false;

        heir = _heir;
        Name = _name;
    }

    function transferThrough(address _from, address _to, uint256 _value, address _tokenAddr) internal returns (bool success) {
        // Calls transferFrom at specified token address
        // Should only be able to be called by withdraw after verification
        ERC20Token tok = ERC20Token(_tokenAddr);
        if (tok.transferFrom(_from, _to, _value)) {
            return true;
        }
        else {
            return false;
        }
    }

    function getAllowance(address _tokenAddr) constant returns (uint256 amount) {
        // Find how much this DethSwitch contract is allowed to send on behalf of parent
        ERC20Token tok = ERC20Token(_tokenAddr);
        amount = tok.allowance(parent.addr, address(this));
        return amount;
    }

    function withdraw(address _tokenAddr) onlyHeir onlyIfDead returns (bool success) {
        uint256 amount;
        amount = getAllowance(_tokenAddr);
        if (amount > 0) {
            transferThrough(parent.addr, heir, amount, _tokenAddr);
        }
    }

}

contract DethSwitchFactory {

    bytes32[] public names;
    address[] public contracts;

    struct deployedContract{
        address contractAddr;
        address heir;
        string name;
    }

    mapping (address => deployedContract) public deployedContracts;

    // Deploys new DethSwitch contract
    function newDethSwitch(address _heir, string _name) returns (address addr) {
        address newDethSwitchAddress;
        newDethSwitchAddress = new DethSwitch(msg.sender, _heir, _name);
        deployedContract newDethSwitchContract;
        newDethSwitchContract.contractAddr = newDethSwitchAddress;
        newDethSwitchContract.heir = _heir;
        newDethSwitchContract.name = _name;
        deployedContracts[msg.sender] = newDethSwitchContract;
        return newDethSwitchAddress;
    }

    function getName() constant returns(string contractName) {
        return deployedContracts[msg.sender].name;
    }

    function getAddress() constant returns(address contractAddress) {
        return deployedContracts[msg.sender].contractAddr;
    }

    function getHeir() constant returns(address heirAddress) {
        return deployedContracts[msg.sender].heir;
    }



}

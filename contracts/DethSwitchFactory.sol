pragma solidity ^0.4.4;

contract ERC20Token {
    // function definition of generic ERC20 token
    // necessary for DethSwitch to be able to reference functions in another contract
    function transferFrom(address _from, address _to, uint _value) returns (bool success) {}
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {}
}

contract DethSwitch {
    
    // TODO: make mapping that stores token addresses, heirs and values ?
    // TODO: make check-in feature
    // TODO: add getters for heir, parent

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

    function getHeir() view returns (address _heir) {
        return heir;
    }

    function getParent() view returns (address _parent) {
        return parent.addr;
    }

    function getName() view returns (string _name) {
        return Name;
    }

}

contract DethSwitchFactory {


    mapping (address => address[]) public deployedContractsByParent;
    mapping (address => address[]) public deployedContractsByHeir;

    // Deploys new DethSwitch contract
    function newDethSwitch(address _heir, string _name) returns (address addr) {
        address newDethSwitchAddress;
        newDethSwitchAddress = new DethSwitch(msg.sender, _heir, _name);
        // Store contract information by owner and by heir
        deployedContractsByParent[msg.sender].push(newDethSwitchAddress);
        deployedContractsByHeir[_heir].push(newDethSwitchAddress);
        return newDethSwitchAddress;
    }

    // Return number of contracts in struct array. Needed because can't return dynamic array
    // Implementation feels clumsy though
    function getNumberOfOwnedContracts() view returns (uint256 numContracts) {
        return deployedContractsByParent[msg.sender].length;
    }

    function getNumberOfHeirContracts() view returns (uint256 numContracts) {
        return deployedContractsByHeir[msg.sender].length;
    }

    function getOwnedContracts(uint256 contractIndex) view returns(address contractAddress) {
        return deployedContractsByParent[msg.sender][contractIndex];
    }

    function getHeirContracts(uint256 contractIndex) view returns(address contractAddress) {
        return deployedContractsByHeir[msg.sender][contractIndex];
    }

}

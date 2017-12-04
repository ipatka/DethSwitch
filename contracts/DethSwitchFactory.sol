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


    function DethSwitch(address _parent, address _heir) {
    // constructor
        parent.addr = _parent;
        // for debugging, parent always dead
        parent.alive = false;

        heir = _heir;
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

    function getAllowance(address _tokenAddr) returns (uint256 amount) {
        // Find how much this DethSwitch contract is allowed to send on behalf of parent
        ERC20Token tok = ERC20Token(_tokenAddr);
        amount = tok.allowance(parent.addr, address(this));
        return amount;
    }

    function withdraw(address _tokenAddr) onlyHeir returns (bool success) {
        uint256 amount;
        amount = getAllowance(_tokenAddr);
        if (amount > 0) {
            transferThrough(parent.addr, heir, amount, _tokenAddr);
        }
    }

}

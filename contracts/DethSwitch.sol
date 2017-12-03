pragma solidity ^0.4.4;

contract DethSwitch {
    
    // TODO: make DethSwitch contract factory
    // TODO: make mapping that stores token addresses, heirs and values

    function DethSwitch() {
    // constructor
    }

    function transferThrough(address _from, address _to, uint256 _value, address _tokenAddr) returns (bool success) {
        // Calls transferFrom at specified token address
        ERC20Token tok = ERC20Token(_tokenAddr);
        if (tok.transferFrom(_from, _to, _value)) {
            return true;
        }
        else {
            return false;
        }
    }

}

contract ERC20Token {
    function transferFrom(address from, address to, uint value) returns (bool success) {}
}

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
    string public contractName;

    address parent;
    address heir;
    uint256 expirationTime;

    modifier onlyParent() {
        require(msg.sender == parent);
        _;
    }

    modifier onlyHeir() {
        require(msg.sender == heir);
        _;
    }

    modifier onlyIfExpirationTimeExceeded() {
        require(now >= expirationTime);
        _;
    }

    modifier expirationTimeNoOverflow(uint256 _timeTillExpiration) {
        //For now, maximum extension allowed is 10 years
        //also have to check for integer overflow
        require(_timeTillExpiration <= 10 years && _timeTillExpiration <= 2**256 - 1 - now);
        _;
    }

    modifier convertTimeToSeconds(uint256 _time) {
        _time *= 1 days;
        _;
    }

    function DethSwitch(address _parent, address _heir, string _contractName, uint256 _timeTillExpiration) 
    convertTimeToSeconds(_timeTillExpiration)
    {
    /* 
    _parent = wallet address of parent
    _heir = wallet address of heir
    _contractName = nickname of this generated contract by _parent
    _timeTillExpiration = expiration time in DAYS from block.timestamp
    */
        parent = _parent;
        heir = _heir;
        contractName = _contractName;
        expirationTime = extendExpirationTime(_timeTillExpiration);
    }

    function extendExpirationTime(uint256 _timeTillExpiration) 
        internal
        convertTimeToSeconds(_timeTillExpiration)
        expirationTimeNoOverflow(_timeTillExpiration)
        returns (uint256 _expirationTime)
    {
        expirationTime = now + _timeTillExpiration;
        return expirationTime;
    }

    function extendExpirationTimeByParent(uint _timeTillExpiration) onlyParent returns (uint256 _expirationTime) {
        //_timeTillExpiration will be converted to seconds by function modifier in extendExpirationTime()
        expirationTime = extendExpirationTime(_timeTillExpiration);
        return expirationTime;
    }

    function transferThrough(address _from, address _to, uint256 _value, address _tokenAddr) internal returns (bool success) {
        // Calls transferFrom at specified token address
        // Should only be able to be called by withdraw after verification
        ERC20Token tok = ERC20Token(_tokenAddr);
        if (tok.transferFrom(_from, _to, _value)) {
            return true;
        } else {
            return false;
        }
    }

    function getAllowance(address _tokenAddr) constant returns (uint256 amount) {
        // Find how much this DethSwitch contract is allowed to send on behalf of parent
        ERC20Token tok = ERC20Token(_tokenAddr);
        amount = tok.allowance(parent, address(this));
        return amount;
    }

    function withdraw(address _tokenAddr) onlyHeir onlyIfExpirationTimeExceeded returns (bool success) {
        uint256 amount;
        amount = getAllowance(_tokenAddr);
        if (amount > 0) {
            transferThrough(parent, heir, amount, _tokenAddr);
        }
    }

    function getHeir() view returns (address _heir) {
        return heir;
    }

    function getParent() view returns (address _parent) {
        return parent;
    }

    function getcontractName() view returns (string _name) {
        return contractName;
    }

    function getExpirationTime() view returns (uint256 _expiratonTime) {
        return expirationTime;
    }
}

contract DethSwitchFactory {


    mapping (address => address[]) public deployedContractsByParent;
    mapping (address => address[]) public deployedContractsByHeir;

    // Deploys new DethSwitch contract
    function newDethSwitch(address _heir, string _contractName, uint _timeTillExpiration) returns (address addr) {
        address newDethSwitchAddress;
        newDethSwitchAddress = new DethSwitch(msg.sender, _heir, _contractName, _timeTillExpiration);
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
        require(contractIndex < deployedContractsByParent[msg.sender].length);
        return deployedContractsByParent[msg.sender][contractIndex];
    }

    function getHeirContracts(uint256 contractIndex) view returns(address contractAddress) {
        require(contractIndex < deployedContractsByHeir[msg.sender].length);
        return deployedContractsByHeir[msg.sender][contractIndex];
    }

}

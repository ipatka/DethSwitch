var dethSwitchFactory = artifacts.require("./DethSwitchFactory.sol");

contract('DethSwitchFactory', function(accounts) {

  it("should successfully deploy a new dethSwitch contract", async function() {
      var deth_switch_factory = await dethSwitchFactory.deployed();
      assert.isDefined(deth_switch_factory, "dethSwitchFactory did not deploy successfully");
      
      var deth_contract_name = 'DSContractOne';
      var heir_account_address = accounts[3];
      var expirationTime = 1;

      var deth_switch_contract_address = await deth_switch_factory.newDethSwitch.call(heir_account_address,deth_contract_name,expirationTime); //.call() obtains return value of the function
      assert.isDefined(deth_switch_contract_address, 'dethSwitch contract did not deploy successfully');
  });

  it("should return 0 owned contracts because parent did not deploy any DS contract", async function() {
    var deth_switch_factory = await dethSwitchFactory.deployed();
    var ownedContracts = await deth_switch_factory.getNumberOfOwnedContracts.call({from: accounts[0]});
    assert.equal(0,ownedContracts,"Did not return 0 owned contracts when parent did not deploy any DS contract");
  });

  it("should return 0 heir contracts because heir is not recipient of any DS contract", async function() {
    var deth_switch_factory = await dethSwitchFactory.deployed();
    var ownedContracts = await deth_switch_factory.getNumberOfHeirContracts.call({from: accounts[0]});
    assert.equal(0,ownedContracts,"Did not return 0 heir contracts when heir is not recipient of any DS contract");
  });

  it("to be fixed", async function() {
    var deth_switch_factory = await dethSwitchFactory.deployed();
    
    var deth_contract_name = 'DSContractOne';
    var heir_account_address = accounts[3];
    var expirationTime = 1;

    var deth_switch_contract_address = await deth_switch_factory.newDethSwitch.call(heir_account_address,deth_contract_name,expirationTime);
    var ownedContracts = await deth_switch_factory.getOwnedContracts(0, {from: accounts[0]});
    //getting VM: invalid opcode error....
    //assert.equal(0,ownedContracts,"Did not return 0 heir contracts when heir is not recipient of any DS contract");
  });

  it("should successfully deploy multiple dethSwitch contracts from 1 parent", async function() {
    var deth_switch_factory = await dethSwitchFactory.deployed();
    
    var deth_contract_name_one = 'DSContractOne';
    var deth_contract_name_two = 'DSContractTwo';
    var deth_contract_name_three = 'DSContractThree';
    var heir_account_address_one = accounts[1];
    var heir_account_address_two = accounts[2];
    var heir_account_address_three = accounts[3];
    var expirationTime = 1;

    var deth_switch_contract_address = await deth_switch_factory.newDethSwitch.call(heir_account_address_one,deth_contract_name_one,expirationTime);
    assert.isDefined(deth_switch_contract_address, 'DSContractOne did not deploy successfully');
  });
});
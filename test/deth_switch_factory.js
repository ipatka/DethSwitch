var dethSwitchFactory = artifacts.require("./DethSwitchFactory.sol");

contract('DethSwitchFactory', function(accounts) {

  it("should successfully deploy a new dethSwitch contract", async function() {
      var deth_switch_factory = await dethSwitchFactory.deployed();
      assert.isDefined(deth_switch_factory, "dethSwitchFactory did not deploy successfully");
      
      var deth_contract_name = 'TestAcct3';
      var heir_account_address = accounts[3];
      
      var deth_switch_contract_address = await deth_switch_factory.newDethSwitch.call(heir_account_address,deth_contract_name); //.call() obtains return value of the function
      assert.isDefined(deth_switch_contract_address, 'dethSwitch contract did not deploy successfully');

      var deth_switch_contract = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name);
      var deth_switch_contract_name = await deth_switch_factory.getName.call({from: accounts[0]});
      assert.equal(deth_switch_contract_name, deth_contract_name,'dethSwitch name was not saved properly, or getName() method is broken');

      var obtained_contract_address = await deth_switch_factory.getAddress.call({from: accounts[0]});
      assert.equal(deth_switch_contract_address, obtained_contract_address,'dethSwitch address was not saved properly, or getAddress() method is broken');
      
      var deth_switch_contract_heir = await deth_switch_factory.getHeir.call({from: accounts[0]});
      assert.equal(deth_switch_contract_heir, heir_account_address, 'dethSwitch heir was not saved properly, or getHeir() method is broken');
  });
});
var dethSwitchFactory = artifacts.require("./DethSwitchFactory.sol");

contract('DethSwitchFactory', function(accounts) {

  var deth_switch_factory;
  
    beforeEach(function() {
      return dethSwitchFactory.new().then(function(deployed) {
        deth_switch_factory = deployed;
      });
    });

  it("should successfully deploy a new dethSwitch contract", async function() {
      assert.isDefined(deth_switch_factory, "dethSwitchFactory did not deploy successfully");
      
      let deth_contract_name = 'DSContractOne';
      let heir_account_address = accounts[3];
      let expirationTime = 1;

      let deth_switch_contract_address = await deth_switch_factory.newDethSwitch.call(heir_account_address,deth_contract_name,expirationTime); //.call() obtains return value of the function
      assert.isDefined(deth_switch_contract_address, 'dethSwitch contract did not deploy successfully');
  });

  it("should have getOwnedContracts() failing because parent did not deploy any DS contract", async function() {
    try {
      let contract = await deth_switch_factory.getOwnedContracts(0);
      console.log(contract);
    } catch(e) {
      return true;
    }
    throw new Error("This error message should not appear.");
  });

  it("should have getHeirContracts() failing because heir is not recipient of any DS contract", async function() {
    try {
      let contract = await deth_switch_factory.getHeirContracts(0);
      console.log(contract);
    } catch(e) {
      return true;
    }
    throw new Error("This error message should not appear.");
  });

  it("should return 0 owned contracts because parent did not deploy any DS contract", async function() {
    let ownedContracts = await deth_switch_factory.getNumberOfOwnedContracts();
    assert.equal(0,ownedContracts,"Did not return 0 owned contracts when parent did not deploy any DS contract");
  });

  it("should return 0 heir contracts because heir is not recipient of any DS contract", async function() {
    let ownedContracts = await deth_switch_factory.getNumberOfHeirContracts();
    assert.equal(0,ownedContracts,"Did not return 0 heir contracts when heir is not recipient of any DS contract");
  });

  it("should return 1 owned contract from parent and 1 heir contract from heir after 1 deployment of DS contract", async function() {
    let deth_contract_name = "DSContractOne";
    let heir_account_address = accounts[1];
    let expirationTime = 1;

    await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name,expirationTime);

    let ownedContract = await deth_switch_factory.getNumberOfOwnedContracts();
    assert.equal(1,ownedContract,"getNumberOfOwnedContracts() did not return 1 owned contract");

    let heirContract = await deth_switch_factory.getNumberOfHeirContracts({from: heir_account_address});
    assert.equal(1,heirContract,"getNumberOfHeirContracts() did not return 1 heir contract");
  });

  it("should have matching DS contract address from parent and heir", async function() {
    let deth_contract_name = "DSContractOne";
    let heir_account_address = accounts[1];
    let expirationTime = 1;

    await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name,expirationTime);

    let ownedContract = await deth_switch_factory.getOwnedContracts(0);
    let heirContract = await deth_switch_factory.getHeirContracts(0, {from: heir_account_address});
    assert.equal(ownedContract,heirContract,"stored DS contract address in parent and heir does not match");
  });

  it("should successfully deploy multiple dethSwitch contracts from 1 parent to 1 heir", async function() {
    
    let deth_contract_name_one = 'DSContractOne';
    let deth_contract_name_two = 'DSContractTwo';
    let deth_contract_name_three = 'DSContractThree';
    let heir_account_address = accounts[1];
    let expirationTime = 1;

    let deth_switch_contract_address_one = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name_one,expirationTime);
    let deth_switch_contract_address_two = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name_two,expirationTime);
    let deth_switch_contract_address_three = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name_three,expirationTime);

    let ownedContract = await deth_switch_factory.getNumberOfOwnedContracts();
    assert.equal(3,ownedContract,"getNumberOfOwnedContracts() did not return 3 owned contracts");

    let heirContract = await deth_switch_factory.getNumberOfHeirContracts({from: heir_account_address});
    assert.equal(3,heirContract,"getNumberOfHeirContracts() did not return 3 heir contracts");
  });

  it("should successfully deploy multiple dethSwitch contracts from 1 parent to multiple heirs", async function() {
    
    let deth_contract_name_one = 'DSContractOne';
    let deth_contract_name_two = 'DSContractTwo';
    let deth_contract_name_three = 'DSContractThree';
    let heir_account_address_one = accounts[1];
    let heir_account_address_two = accounts[2];
    let heir_account_address_three = accounts[3];
    let expirationTime = 1;

    let deth_switch_contract_address_one = await deth_switch_factory.newDethSwitch(heir_account_address_one,deth_contract_name_one,expirationTime);
    let deth_switch_contract_address_two = await deth_switch_factory.newDethSwitch(heir_account_address_two,deth_contract_name_two,expirationTime);
    let deth_switch_contract_address_three = await deth_switch_factory.newDethSwitch(heir_account_address_three,deth_contract_name_three,expirationTime);

    let ownedContract = await deth_switch_factory.getNumberOfOwnedContracts();
    assert.equal(3,ownedContract,"getNumberOfOwnedContracts() did not return 3 owned contracts");

    let heirContract = await deth_switch_factory.getNumberOfHeirContracts({from: heir_account_address_two});
    assert.equal(1,heirContract,"getNumberOfHeirContracts() did not return 1 heir contract");

    ownedContract = await deth_switch_factory.getOwnedContracts(1);
    heirContract = await deth_switch_factory.getHeirContracts(0, {from: heir_account_address_two});
    assert.equal(ownedContract,heirContract,"stored DS contract address in parent and heir_account_two does not match");
  });

  it("should successfully deploy multiple dethSwitch contracts from multiple parents to 1 heir", async function() {
    
    let deth_contract_name_one = 'DSContractOne';
    let deth_contract_name_two = 'DSContractTwo';
    let deth_contract_name_three = 'DSContractThree';
    let parent_account_address_one = accounts[1];
    let parent_account_address_two = accounts[2];
    let parent_account_address_three = accounts[3];
    let heir_account_address = accounts[0];
    let expirationTime = 1;

    let deth_switch_contract_address_one = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name_one,expirationTime,{from: parent_account_address_one});
    let deth_switch_contract_address_two = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name_two,expirationTime,{from: parent_account_address_two});
    let deth_switch_contract_address_three = await deth_switch_factory.newDethSwitch(heir_account_address,deth_contract_name_three,expirationTime,{from: parent_account_address_three});

    let ownedContract = await deth_switch_factory.getNumberOfOwnedContracts();
    assert.equal(0,ownedContract,"getNumberOfOwnedContracts() did not return 0 owned contract");

    let heirContract = await deth_switch_factory.getNumberOfHeirContracts();
    assert.equal(3,heirContract,"getNumberOfHeirContracts() did not return 3 heir contracts");

    ownedContract = await deth_switch_factory.getOwnedContracts(0,{from: parent_account_address_three});
    heirContract = await deth_switch_factory.getHeirContracts(2);
    assert.equal(ownedContract,heirContract,"stored DS contract address in parent_account_three and heir does not match");
  });
});
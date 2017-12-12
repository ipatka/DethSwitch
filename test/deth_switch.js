var DethSwitch = artifacts.require("./DethSwitch.sol");

contract('DethSwitch', function(accounts) {

  it("should assert true", function(done) {
    var deth_switch = DethSwitch.deployed();
    assert.isTrue(true);
    done();
  });
});

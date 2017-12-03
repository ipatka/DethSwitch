//var AnyERC20Token = artifacts.require("./AnyERC20Token.sol");
var DethSwitch = artifacts.require("./DethSwitch.sol");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(DethSwitch);
};

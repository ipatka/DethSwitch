//var AnyERC20Token = artifacts.require("./AnyERC20Token.sol");
var DethSwitchFactory = artifacts.require("./DethSwitchFactory.sol");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
 //   deployer.deploy(AnyERC20Token);
    deployer.deploy(DethSwitchFactory);
};

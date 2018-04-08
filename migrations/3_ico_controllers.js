const ICOController = artifacts.require("./ICOController.sol");
const RAECoin = artifacts.require("./RAECoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ICOController, RAECoin.address, 200);
};

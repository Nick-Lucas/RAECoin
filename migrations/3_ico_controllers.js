const ICOController = artifacts.require("./ICOController.sol")

module.exports = function(deployer) {
  deployer.deploy(ICOController, 200)
}

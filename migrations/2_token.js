// var ContractResolver = artifacts.require("./ERC223/IContractReceiver.sol")
// var TokenRecip = artifacts.require("./ERC223/ITokenRecipient.sol")
// var Token = artifacts.require("./ERC223/Token.sol")
var RAECoin = artifacts.require("./RAECoin.sol")

module.exports = function(deployer) {
  // deployer.deploy(ContractResolver)
  // deployer.deploy(TokenRecip)
  // deployer.deploy(Token)
  deployer.deploy(RAECoin)
}

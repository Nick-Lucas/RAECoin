const ICOController = artifacts.require("./ICOController.sol");
const RAECoin = artifacts.require("./RAECoin.sol");

const ICOValue = web3.toWei(5000000, "ether");
const tokensPerEther = 200;

module.exports = function(deployer) {
  deployer.deploy(ICOController, RAECoin.address, tokensPerEther).then(() => {
    RAECoin.deployed().then(rae =>
      rae
        // ether is just a convenient conversion since RAE has 18 decimals too
        .transfer(ICOController.address, ICOValue)
        .then(success => console.log("Transferred ICO funds: " + ICOValue))
    );
  });
};

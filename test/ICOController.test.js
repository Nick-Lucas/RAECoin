require("babel-polyfill");
const RAECoin = artifacts.require("./RAECoin.sol");
const ICOController = artifacts.require("./ICOController.sol");
const BigNumber = require("bignumber.js");

const BIG_0 = new BigNumber(0);
const decimalsMultiplier = new BigNumber(10).pow(18);
const toCoinAmount = (value = 0) =>
  new BigNumber(value).times(decimalsMultiplier);
const COIN_SUPPLY = toCoinAmount(10 * 1000 * 1000);

const bigEqual = (b1, b2) => assert.equal(b1.toNumber(), b2.toNumber());

contract("ICOController", function(accounts) {
  let rae;

  let ico;
  let tokensPerEther;

  beforeEach(async () => {
    tokensPerEther = 200;
    rae = await RAECoin.new();

    // Set up the ICO
    ico = await ICOController.new(rae.address, tokensPerEther);
    rae.transfer(ico.address, toCoinAmount(5000000), { from: accounts[0] });
  });

  context("ICO partake", () => {
    it("should have proper starting balances", async () => {
      const ownerBalance = await rae.balanceOf.call(accounts[0], {
        from: accounts[0]
      });
      bigEqual(ownerBalance, toCoinAmount(5000000));

      const icoBalance = await rae.balanceOf.call(ico.address, {
        from: ico.address
      });
      bigEqual(icoBalance, toCoinAmount(5000000));

      const senderBalance = await rae.balanceOf.call(accounts[1], {
        from: accounts[1]
      });
      bigEqual(senderBalance, BIG_0);

      const ownerEthBalance = await web3.eth.getBalance(accounts[0]);
      const senderEthBalance = await web3.eth.getBalance(accounts[1]);
      assert(ownerEthBalance.toNumber() > toCoinAmount(99).toNumber()); // gas costs for deployment
      bigEqual(senderEthBalance, toCoinAmount(100));
    });

    it("should pay me tokens at the exchange rate, when I send 1 Ethereum", async () => {
      await ico.sendTransaction({
        from: accounts[1],
        gasPrice: 0,
        value: web3.toWei(1, "ether")
      });

      const icoEthBalance = await web3.eth.getBalance(ico.address);
      const investorEthBalance = await web3.eth.getBalance(accounts[1]);
      bigEqual(icoEthBalance, toCoinAmount(1));
      bigEqual(investorEthBalance, toCoinAmount(99));

      const expectedRaeTransfer = toCoinAmount(tokensPerEther);
      const icoRaeBalance = await rae.balanceOf.call(ico.address);
      const investorRaeBalance = await rae.balanceOf.call(accounts[1]);
      bigEqual(icoRaeBalance, toCoinAmount(5000000).minus(expectedRaeTransfer));
      bigEqual(investorRaeBalance, expectedRaeTransfer);
    });
  });
});

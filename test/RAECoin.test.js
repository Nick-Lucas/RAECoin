require("babel-polyfill")
var RAECoin = artifacts.require("./RAECoin.sol")
const BigNumber = require("bignumber.js")

const BIG_0 = new BigNumber(0)
const decimalsMultiplier = new BigNumber(10).pow(18)
const toCoinAmount = (value = 0) =>
  new BigNumber(value).times(decimalsMultiplier)
const COIN_SUPPLY = toCoinAmount(10 * 1000 * 1000)

const bigEqual = (b1, b2) => assert.equal(b1.toNumber(), b2.toNumber())

contract("RAECoin", function(accounts) {
  let rae

  beforeEach(async () => {
    rae = await RAECoin.new()
  })

  context("balanceOf", () => {
    it("should give the first account 10m tokens", async () => {
      const balance = await rae.balanceOf.call(accounts[0], {
        from: accounts[0]
      })
      bigEqual(balance, COIN_SUPPLY)
    })

    it("should give another account 0 tokens", async () => {
      const balance = await rae.balanceOf.call(accounts[1], {
        from: accounts[0]
      })
      bigEqual(balance, BIG_0)
    })

    it("should allow balance access from any account", async () => {
      const balance = await rae.balanceOf.call(accounts[0], {
        from: accounts[1]
      })
      bigEqual(balance, COIN_SUPPLY)
    })
  })

  context("transfer", () => {
    it("should allow account to transfer its balance", async () => {
      const transferAmount = toCoinAmount(2500)

      const senderStartBalance = await rae.balanceOf.call(accounts[0])
      assert.equal(senderStartBalance.toNumber(), COIN_SUPPLY.toNumber())

      const receiverStartBalance = await rae.balanceOf.call(accounts[1])
      assert.equal(receiverStartBalance, 0)

      await rae.transfer(accounts[1], transferAmount, {
        from: accounts[0]
      })

      const senderEndBalance = await rae.balanceOf.call(accounts[0])
      bigEqual(senderEndBalance, COIN_SUPPLY.minus(transferAmount))

      const receiverEndBalance = await rae.balanceOf.call(accounts[1])
      bigEqual(receiverEndBalance, transferAmount)
    })

    it("should reject transfer when the balance is too low", async () => {
      const initialBalance = toCoinAmount(1000)
      const transferAmount = toCoinAmount(1001)

      // Setup state
      await rae.transfer(accounts[2], initialBalance, {
        from: accounts[0]
      })

      // Test
      const senderStartBalance = await rae.balanceOf.call(accounts[2])
      bigEqual(senderStartBalance, initialBalance)

      const receiverStartBalance = await rae.balanceOf.call(accounts[1])
      bigEqual(receiverStartBalance, BIG_0)

      return rae
        .transfer(accounts[1], transferAmount, {
          from: accounts[2]
        })
        .then(
          () => {
            assert(false, "Transfer should have thrown")
          },
          e => {
            assert.match(
              e,
              /VM Exception/,
              "transfer should have raised VM exception"
            )
          }
        )
    })

    it("should allow transfers of 0 amount", async () => {
      // Setup state
      const initialBalance = toCoinAmount(1000)
      await rae.transfer(accounts[2], initialBalance, {
        from: accounts[0]
      })

      // Test
      const senderStartBalance = await rae.balanceOf.call(accounts[2])
      bigEqual(senderStartBalance, initialBalance)

      const receiverStartBalance = await rae.balanceOf.call(accounts[1])
      bigEqual(receiverStartBalance, BIG_0)

      await rae.transfer(accounts[1], 0, {
        from: accounts[2]
      })

      const senderEndBalance = await rae.balanceOf.call(accounts[2])
      bigEqual(senderEndBalance, initialBalance)

      const receiverEndBalance = await rae.balanceOf.call(accounts[1])
      bigEqual(receiverEndBalance, BIG_0)
    })
  })
})

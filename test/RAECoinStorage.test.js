require("babel-polyfill")
var RAECoinStorage = artifacts.require("./RAECoinStorage.sol")

contract("RAECoinStorage", function(accounts) {
  let rae

  beforeEach(async () => {
    rae = await RAECoinStorage.new()
  })

  context("getBalance", () => {
    it("should give the first account 10m tokens", async () => {
      // const rae = await RAECoinStorage.deployed()
      const balance = await rae.getBalance.call(accounts[0], {
        from: accounts[0]
      })
      assert.equal(balance, 10 * 1000 * 1000)
    })

    it("should give another account 0 tokens", async () => {
      // const rae = await RAECoinStorage.deployed()
      const balance = await rae.getBalance.call(accounts[1], {
        from: accounts[0]
      })
      assert.equal(balance, 0)
    })

    it("should allow balance access from any account", async () => {
      // const rae = await RAECoinStorage.deployed()
      const balance = await rae.getBalance.call(accounts[0], {
        from: accounts[1]
      })
      assert.equal(balance, 10 * 1000 * 1000)
    })
  })

  context("transferBalance", () => {
    it("should allow owner to transfer its balance", async () => {
      // const rae = await RAECoinStorage.deployed()

      const senderStartBalance = await rae.getBalance.call(accounts[0])
      assert.equal(senderStartBalance, 10 * 1000 * 1000)

      const receiverStartBalance = await rae.getBalance.call(accounts[1])
      assert.equal(receiverStartBalance, 0)

      await rae.transferBalance(accounts[0], accounts[1], 2500, {
        from: accounts[0]
      })

      const senderEndBalance = await rae.getBalance.call(accounts[0])
      assert.equal(senderEndBalance, senderStartBalance - 2500)

      const receiverEndBalance = await rae.getBalance.call(accounts[1])
      assert.equal(receiverEndBalance, 2500)
    })

    it("should allow non-owner to transfer its own balances", async () => {
      const rae = await RAECoinStorage.deployed()
      await rae.transferBalance(accounts[0], accounts[2], 10000, {
        from: accounts[0]
      })

      const senderStartBalance = await rae.getBalance.call(accounts[2])
      assert.equal(senderStartBalance, 10000)

      const receiverStartBalance = await rae.getBalance.call(accounts[1])
      assert.equal(receiverStartBalance, 0)

      await rae.transferBalance(accounts[2], accounts[1], 2500, {
        from: accounts[2]
      })

      const senderEndBalance = await rae.getBalance.call(accounts[2])
      assert.equal(senderEndBalance, 7500)

      const receiverEndBalance = await rae.getBalance.call(accounts[1])
      assert.equal(receiverEndBalance, 2500)
    })

    it("should reject transfer when the balance is too low")
  })
})

//
//
// it("should put 10000 MetaCoin in the first account", function() {
//   return MetaCoin.deployed()
//     .then(function(instance) {
//       return instance.getBalance.call(accounts[0]);
//     })
//     .then(function(balance) {
//       assert.equal(
//         balance.valueOf(),
//         10000,
//         "10000 wasn't in the first account"
//       );
//     });
// });
// it("should call a function that depends on a linked library", function() {
//   var meta;
//   var metaCoinBalance;
//   var metaCoinEthBalance;
//   return MetaCoin.deployed()
//     .then(function(instance) {
//       meta = instance;
//       return meta.getBalance.call(accounts[0]);
//     })
//     .then(function(outCoinBalance) {
//       metaCoinBalance = outCoinBalance.toNumber();
//       return meta.getBalanceInEth.call(accounts[0]);
//     })
//     .then(function(outCoinBalanceEth) {
//       metaCoinEthBalance = outCoinBalanceEth.toNumber();
//     })
//     .then(function() {
//       assert.equal(
//         metaCoinEthBalance,
//         2 * metaCoinBalance,
//         "Library function returned unexpected function, linkage may be broken"
//       );
//     });
// });
// it("should send coin correctly", function() {
//   var meta;
//   // Get initial balances of first and second account.
//   var account_one = accounts[0];
//   var account_two = accounts[1];
//   var account_one_starting_balance;
//   var account_two_starting_balance;
//   var account_one_ending_balance;
//   var account_two_ending_balance;
//   var amount = 10;
//   return MetaCoin.deployed()
//     .then(function(instance) {
//       meta = instance;
//       return meta.getBalance.call(account_one);
//     })
//     .then(function(balance) {
//       account_one_starting_balance = balance.toNumber();
//       return meta.getBalance.call(account_two);
//     })
//     .then(function(balance) {
//       account_two_starting_balance = balance.toNumber();
//       return meta.sendCoin(account_two, amount, { from: account_one });
//     })
//     .then(function() {
//       return meta.getBalance.call(account_one);
//     })
//     .then(function(balance) {
//       account_one_ending_balance = balance.toNumber();
//       return meta.getBalance.call(account_two);
//     })
//     .then(function(balance) {
//       account_two_ending_balance = balance.toNumber();
//       assert.equal(
//         account_one_ending_balance,
//         account_one_starting_balance - amount,
//         "Amount wasn't correctly taken from the sender"
//       );
//       assert.equal(
//         account_two_ending_balance,
//         account_two_starting_balance + amount,
//         "Amount wasn't correctly sent to the receiver"
//       );
//     });
// });

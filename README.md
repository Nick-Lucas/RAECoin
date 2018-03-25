# RAECoin Contracts

## Setup

* Ensure you have `node.js` and `yarn` installed
* run `$ yarn` to install dependencies

## Usage

#### Run the test Suite

`$ yarn test`

#### Setup the app on a local ethereum network

`$ yarn start`

## TODO

* Investigate implementation of ERC223 standard: https://github.com/Dexaran/ERC223-token-standard/tree/Recommended

## Bugs and Questions

* Currently the owner can transfer anyone's currency anywhere, is that acceptable or a potential trust issue?
  * could resolve by enforcing that methods are called by the owner, but attaching the address of the true sender for validation

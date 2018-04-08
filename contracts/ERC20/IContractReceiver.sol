pragma solidity ^0.4.21;

/**
* @title Contract that will work with ERC223 tokens.
*/
interface IContractReceiver {
  function tokenFallback(address from, uint value, bytes data) external;
}
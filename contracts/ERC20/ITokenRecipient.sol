pragma solidity ^0.4.24;

interface ITokenRecipient {
  function receiveApproval(address from, uint256 value, bytes data) external;
}
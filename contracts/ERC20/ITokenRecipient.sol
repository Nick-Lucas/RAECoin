pragma solidity ^0.4.11;

interface ITokenRecipient {
  function receiveApproval(address from, uint256 value, bytes data) public;
}
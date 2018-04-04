pragma solidity ^0.4.11;

import './RAECoin.sol';

contract ICOController {
  address public owner;
  uint8 public tokensPerEther;
  RAECoin rae;

  function ICOController(uint8 initialTokensPerEther)
  public 
  {
    owner = msg.sender;
    tokensPerEther = initialTokensPerEther;
    rae = RAECoin(owner);
  }

  modifier justOwner() {
    require(msg.sender == owner);
    _;
  }

  function () 
  public
  payable 
  {
    address sender = msg.sender;
    uint256 weiReceived = msg.value;

    uint256 amount = weiReceived * tokensPerEther;
    bool success = rae.transfer(sender, amount);
    require(success); // TODO: handle this better, maybe even return the ether?
  }

  function SetExchangeRate(uint8 newTokensPerEther) 
  public
  justOwner 
  {
    tokensPerEther = newTokensPerEther;
  }
}
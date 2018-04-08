pragma solidity ^0.4.11;

import './RAECoin.sol';

contract ICOController {
  address public owner;
  address public raeAddress;
  
  uint8 public tokensPerEther;

  function ICOController(address _raeAddress, uint8 initialTokensPerEther)
  public 
  {
    owner = msg.sender;
    raeAddress = _raeAddress;
    tokensPerEther = initialTokensPerEther;
  }

  modifier justOwner() {
    require(msg.sender == owner);
    _;
  }

  function () 
  external
  payable 
  {
    address sender = msg.sender;
    uint256 weiReceived = msg.value;

    uint256 amount = weiReceived * tokensPerEther;
    bool success = RAECoin(raeAddress).transfer(sender, amount);
    require(success); // TODO: handle this better, maybe even return the ether?
  }

  function SetExchangeRate(uint8 newTokensPerEther) 
  public
  justOwner 
  {
    tokensPerEther = newTokensPerEther;
  }
}
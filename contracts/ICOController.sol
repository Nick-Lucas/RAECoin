pragma solidity ^0.4.21;

import './RAECoin.sol';

contract ICOController {
  address public owner;
  address public raeAddress;
  
  uint256 public tokensPerEther;

  event TokenExchanged(address investor, uint256 etherReceived, uint256 raeSent);

  function ICOController(address _raeAddress, uint256 initialTokensPerEther)
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

    emit TokenExchanged(sender, weiReceived, amount);
  }

  function SetExchangeRate(uint256 newTokensPerEther) 
  public
  justOwner 
  {
    tokensPerEther = newTokensPerEther;
  }
}
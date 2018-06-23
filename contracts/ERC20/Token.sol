pragma solidity ^0.4.24;

// Based on: 
// https://theethereum.wiki/w/index.php/ERC20_Token_Standard
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md

import "./ITokenRecipient.sol";
import "./IContractReceiver.sol";

contract Token {
  address public owner;
  string  public name;        // ERC20
  string  public symbol;      // ERC20
  uint8   public decimals;    // ERC20
  uint256 public totalSupply; // ERC20

  mapping(address => uint256) balances;
  mapping(address => mapping(address => uint256)) allowances;

  // ERC20
  event Approval(
    address indexed owner,
    address indexed spender,
    uint amount
  );

  // ERC20
  event Transfer( 
    address indexed from,
    address indexed to,
    uint256 amount
  );

  constructor( 
    uint256 initialSupply,
    string tokenName,
    uint8 decimalUnits,
    string tokenSymbol
  ) 
    public
  {
    owner = msg.sender;
    
    totalSupply = initialSupply * (10 ** uint256(decimalUnits));
    balances[owner] = totalSupply;

    name = tokenName;
    decimals = decimalUnits;
    symbol = tokenSymbol;
  }

  // ERC20
  function balanceOf(address _address) 
  public 
  view 
  returns (uint) 
  {
    return balances[_address];
  }

  // ERC20
  function approve(address spender, uint256 amount)
  public
  returns (bool success)
  {
    allowances[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }
 
  // ERC20
  function allowance(address _address, address spender) 
  public 
  view
  returns (uint256 remaining)
  {
    return allowances[_address][spender];
  }

  // ERC20
  function transferFrom(address from, address to, uint256 amount) 
  public
  returns (bool success)
  {
    require(allowances[from][msg.sender] >= amount);

    allowances[from][msg.sender] -= amount;
    _transfer(from, to, amount);

    return true;
  }

  // ERC20
  function transfer(address to, uint amount) 
  public
  returns (bool success)
  {
    _transfer(msg.sender, to, amount);
    return true;
  }

  function _transfer(
    address from,
    address to,
    uint amount
  ) 
    internal
  {
    require(to != 0x0);
    require(balances[from] >= amount);
    require(balances[to] + amount >= balances[to]);

    balances[from] -= amount;
    balances[to] += amount;

    emit Transfer(from, to, amount);
  }
}
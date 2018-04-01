pragma solidity ^0.4.11;

// Based on: https://github.com/bitsanity/erc223

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

  // ERC223, ERC20-compatible
  event Transfer( 
    address indexed from,
    address indexed to,
    uint256 amount,
    bytes   data 
  );

  function Token( 
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

  // Prevent transfer of ether to contract
  function() public payable { revert(); }

  // ERC20
  function balanceOf(address _address) 
  public 
  constant 
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
    Approval(msg.sender, spender, amount);
    return true;
  }
 
  // ERC20
  function allowance(address _address, address spender) 
  public 
  constant
  returns (uint256 remaining)
  {
    return allowances[_address][spender];
  }

  // ERC20
  function transfer(address to, uint256 amount) 
  public
  {
    bytes memory empty;
    _transfer(msg.sender, to, amount, empty);
  }

  // ERC20
  function transferFrom(address from, address to, uint256 amount) 
  public
  returns (bool success)
  {
    require(amount <= allowances[from][msg.sender]);

    allowances[from][msg.sender] -= amount;
    bytes memory empty;
    _transfer(from, to, amount, empty);

    return true;
  }

  // Ethereum Token
  function approveAndCall( 
    address spender,
    uint256 amount,
    bytes context 
  ) 
    public
    returns (bool success)
  {
    if (approve(spender, amount))
    {
      ITokenRecipient recip = ITokenRecipient(spender);
      recip.receiveApproval(msg.sender, amount, context);
      return true;
    }
    return false;
  }

  // ERC223 Transfer and invoke specified callback
  function transfer(
    address to,
    uint amount,
    bytes data,
    string custom_fallback
  ) 
    public 
    returns (bool success)
  {
    _transfer(msg.sender, to, amount, data);

    if (isContract(to))
    {
      IContractReceiver rx = IContractReceiver(to);
      require(
        rx.call.value(0)(bytes4(keccak256(custom_fallback)),
        msg.sender,
        amount,
        data) );
    }

    return true;
  }

  // ERC223 Transfer to a contract or externally-owned account
  function transfer(address to, uint amount, bytes data) 
  public
  returns (bool success)
  {
    if (isContract(to)) {
      return transferToContract(to, amount, data);
    }

    _transfer(msg.sender, to, amount, data);
    return true;
  }

  // ERC223 Transfer to contract and invoke tokenFallback() method
  function transferToContract(address to, uint amount, bytes data) 
  private
  returns (bool success)
  {
    _transfer(msg.sender, to, amount, data);

    IContractReceiver rx = IContractReceiver(to);
    rx.tokenFallback(msg.sender, amount, data);

    return true;
  }

  // ERC223 fetch contract size (must be nonzero to be a contract)
  function isContract( address _addr ) 
  private 
  constant 
  returns (bool)
  {
    uint length;
    assembly { length := extcodesize(_addr) }
    return (length > 0);
  }

  function _transfer(
    address from,
    address to,
    uint amount,
    bytes data 
  ) 
    internal
  {
    require(to != 0x0);
    require(balances[from] >= amount);
    require(balances[to] + amount >= balances[to]);

    balances[from] -= amount;
    balances[to] += amount;

    Transfer(from, to, amount, data);
  }
}
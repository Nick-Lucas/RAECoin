pragma solidity ^0.4.17;

contract RAECoinStorage {
    address owner;
    mapping(address => uint) balances;

    function RAECoinStorage() public {
        owner = msg.sender;
        balances[owner] = 10 * 1000 * 1000;
    }

    modifier protected() {
        require(owner == msg.sender);
        _;
    }

    function getBalance(
        address _address
    ) 
        external view returns(uint) 
    {
        return balances[_address];
    }

    function transferBalance(
        address _addressFrom, 
        address _addressTo, 
        uint amount
    ) 
        external 
        protected 
    {
        
        require(balances[_addressFrom] >= amount);
        require(balances[_addressTo] + amount > balances[_addressTo]);

        balances[_addressFrom] -= amount;
        balances[_addressTo] += amount;
    }
}

pragma solidity ^0.4.11;

import "./ERC223/Token.sol";

contract RAECoin is Token {
    function RAECoin() Token(
        10 * 1000 * 1000, 
        "RAECoin", 
        18, 
        "RAE"
    ) 
        public 
    { }
}

pragma solidity ^0.6.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyToken is ERC20 {
 constructor(uint256 initialSupply) ERC20("StarDucks CapuToken", "SCT") public {
    _mint(msg.sender, initialSupply);
 }
}
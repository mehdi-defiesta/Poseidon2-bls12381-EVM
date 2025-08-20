// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "../Poseidon2Yul.sol";
import "../Poseidon4Yul.sol";

contract YulTestContract {
    Poseidon2Yul public poseidon2;
    Poseidon4Yul public poseidon4;
    
    constructor() {
        poseidon2 = new Poseidon2Yul();
        poseidon4 = new Poseidon4Yul();
    }
    
    function testPoseidon2(uint256 x, uint256 y) external view returns (uint256) {
        // Encode inputs as calldata
        bytes memory data = abi.encode(x, y);
        
        // Call the fallback function
        (bool success, bytes memory result) = address(poseidon2).staticcall(data);
        require(success, "Poseidon2 hash failed");
        
        return abi.decode(result, (uint256));
    }
    
    function testPoseidon4(uint256 x, uint256 y, uint256 z, uint256 w) external view returns (uint256) {
        // Encode inputs as calldata
        bytes memory data = abi.encode(x, y, z, w);
        
        // Call the fallback function
        (bool success, bytes memory result) = address(poseidon4).staticcall(data);
        require(success, "Poseidon4 hash failed");
        
        return abi.decode(result, (uint256));
    }
    
    // Test with the specific values from your example
    function testPoseidon2Example() external view returns (uint256) {
        return this.testPoseidon2(
            0x1762d324c2db6a912e607fd09664aaa02dfe45b90711c0dae9627d62a4207788,
            0x1047bd52da536f6bdd26dfe642d25d9092c458e64a78211298648e81414cbf35
        );
    }
}

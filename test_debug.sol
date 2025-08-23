// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "./contracts/Poseidon4.sol";
import "./contracts/Poseidon4Yul.sol";

contract DebugPoseidon4 {
    Poseidon4 poseidon4Standard;
    Poseidon4Yul poseidon4Yul;

    constructor() {
        poseidon4Standard = new Poseidon4();
        poseidon4Yul = new Poseidon4Yul();
    }

    function debugPoseidon4() public view returns (uint256 standardResult, uint256 yulResult) {
        uint256 x = 1;
        uint256 y = 2;
        uint256 z = 3;
        uint256 w = 4;

        standardResult = poseidon4Standard.poseidon4Uint256(x, y, z, w);
        
        // Call Yul implementation
        bytes memory data = abi.encode(x, y, z, w);
        (bool success, bytes memory result) = address(poseidon4Yul).staticcall(data);
        require(success, "Poseidon4Yul staticcall failed");
        yulResult = abi.decode(result, (uint256));
        
        return (standardResult, yulResult);
    }
}

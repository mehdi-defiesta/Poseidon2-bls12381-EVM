// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "forge-std/Test.sol";
import "../contracts/Poseidon2.sol";
import "../contracts/Poseidon2Yul.sol";

contract DeepDebugTest is Test {
    Poseidon2 poseidon2Standard;
    Poseidon2Yul poseidon2Yul;

    function setUp() public {
        poseidon2Standard = new Poseidon2();
        poseidon2Yul = new Poseidon2Yul();
    }

    function testStepByStep() public {
        uint256 x = 0;
        uint256 y = 0;

        uint256 standardResult = poseidon2Standard.poseidon2Uint256(x, y);
        emit log_named_uint("Standard result", standardResult);
        
        // Test Yul with same inputs
        bytes memory data = abi.encode(x, y);
        (bool success, bytes memory result) = address(poseidon2Yul).staticcall(data);
        require(success, "Yul call failed");
        uint256 yulResult = abi.decode(result, (uint256));
        emit log_named_uint("Yul result", yulResult);
        
        // Let's also test with different inputs to see the pattern
        uint256 x2 = 1;
        uint256 y2 = 0;
        
        uint256 standardResult2 = poseidon2Standard.poseidon2Uint256(x2, y2);
        emit log_named_uint("Standard result (1,0)", standardResult2);
        
        bytes memory data2 = abi.encode(x2, y2);
        (bool success2, bytes memory result2) = address(poseidon2Yul).staticcall(data2);
        require(success2, "Yul call failed");
        uint256 yulResult2 = abi.decode(result2, (uint256));
        emit log_named_uint("Yul result (1,0)", yulResult2);
        
        // Check if there's a consistent offset
        if (standardResult != yulResult) {
            uint256 diff = standardResult > yulResult ? 
                standardResult - yulResult : yulResult - standardResult;
            emit log_named_uint("Difference (0,0)", diff);
        }
        
        if (standardResult2 != yulResult2) {
            uint256 diff2 = standardResult2 > yulResult2 ? 
                standardResult2 - yulResult2 : yulResult2 - standardResult2;
            emit log_named_uint("Difference (1,0)", diff2);
        }
    }
}

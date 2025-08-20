// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "forge-std/Test.sol";
import "../contracts/Poseidon2.sol";
import "../contracts/Poseidon2Yul.sol";

contract ZeroTest is Test {
    Poseidon2 poseidon2Standard;
    Poseidon2Yul poseidon2Yul;

    function setUp() public {
        poseidon2Standard = new Poseidon2();
        poseidon2Yul = new Poseidon2Yul();
    }

    function testZeroInputs() public {
        uint256 x = 0;
        uint256 y = 0;

        uint256 standardResult = poseidon2Standard.poseidon2Uint256(x, y);
        
        bytes memory data = abi.encode(x, y);
        (bool success, bytes memory result) = address(poseidon2Yul).staticcall(data);
        require(success, "Yul call failed");
        uint256 yulResult = abi.decode(result, (uint256));

        emit log_named_uint("Standard result (0,0)", standardResult);
        emit log_named_uint("Yul result (0,0)", yulResult);
        
        assertEq(standardResult, yulResult, "Zero inputs should match");
    }
}

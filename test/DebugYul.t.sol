// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "forge-std/Test.sol";
import "../contracts/Poseidon2.sol";
import "../contracts/Poseidon2Yul.sol";

contract DebugYulTest is Test {
    Poseidon2 poseidon2Standard;
    Poseidon2Yul poseidon2Yul;

    function setUp() public {
        poseidon2Standard = new Poseidon2();
        poseidon2Yul = new Poseidon2Yul();
    }

    function testSimpleInputs() public {
        uint256 x = 1;
        uint256 y = 2;

        uint256 standardResult = poseidon2Standard.poseidon2Uint256(x, y);
        
        // Test our calldata encoding
        bytes memory data = abi.encode(x, y);
        (bool success, bytes memory result) = address(poseidon2Yul).staticcall(data);
        require(success, "Yul call failed");
        uint256 yulResult = abi.decode(result, (uint256));

        emit log_named_uint("Standard result", standardResult);
        emit log_named_uint("Yul result", yulResult);
        emit log_named_bytes("Calldata", data);
        
        // Check calldata content
        bytes32 first32;
        bytes32 second32;
        assembly {
            first32 := mload(add(data, 0x20))
            second32 := mload(add(data, 0x40))
        }
        emit log_named_uint("First 32 bytes as uint", uint256(first32));
        emit log_named_uint("Second 32 bytes as uint", uint256(second32));
    }
}

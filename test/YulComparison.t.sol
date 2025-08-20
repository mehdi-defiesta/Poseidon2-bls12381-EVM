// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "forge-std/Test.sol";
import "../contracts/Poseidon2.sol";
import "../contracts/Poseidon4.sol";
import "../contracts/Poseidon2Yul.sol";
import "../contracts/Poseidon4Yul.sol";

contract YulComparisonTest is Test {
    Poseidon2 poseidon2Standard;
    Poseidon4 poseidon4Standard;
    Poseidon2Yul poseidon2Yul;
    Poseidon4Yul poseidon4Yul;

    function setUp() public {
        poseidon2Standard = new Poseidon2();
        poseidon4Standard = new Poseidon4();
        poseidon2Yul = new Poseidon2Yul();
        poseidon4Yul = new Poseidon4Yul();
    }

    // Helper function to call Yul contracts using staticcall
    function callPoseidon2Yul(uint256 x, uint256 y) internal view returns (uint256) {
        bytes memory data = abi.encode(x, y);
        (bool success, bytes memory result) = address(poseidon2Yul).staticcall(data);
        require(success, "Poseidon2Yul staticcall failed");
        return abi.decode(result, (uint256));
    }

    // Helper function to call Yul contracts using regular call
    function callPoseidon2YulWithCall(uint256 x, uint256 y) internal returns (uint256) {
        bytes memory data = abi.encode(x, y);
        (bool success, bytes memory result) = address(poseidon2Yul).call(data);
        require(success, "Poseidon2Yul call failed");
        return abi.decode(result, (uint256));
    }

    // Helper function for Poseidon4Yul with staticcall
    function callPoseidon4Yul(uint256 x, uint256 y, uint256 z, uint256 w) internal view returns (uint256) {
        bytes memory data = abi.encode(x, y, z, w);
        (bool success, bytes memory result) = address(poseidon4Yul).staticcall(data);
        require(success, "Poseidon4Yul staticcall failed");
        return abi.decode(result, (uint256));
    }

    // Helper function for Poseidon4Yul with regular call
    function callPoseidon4YulWithCall(uint256 x, uint256 y, uint256 z, uint256 w) internal returns (uint256) {
        bytes memory data = abi.encode(x, y, z, w);
        (bool success, bytes memory result) = address(poseidon4Yul).call(data);
        require(success, "Poseidon4Yul call failed");
        return abi.decode(result, (uint256));
    }

    // Test that both call types work for Poseidon2
    function testPoseidon2CallTypes() public {
        uint256 x = 0x1762d324c2db6a912e607fd09664aaa02dfe45b90711c0dae9627d62a4207788;
        uint256 y = 0x1047bd52da536f6bdd26dfe642d25d9092c458e64a78211298648e81414cbf35;

        uint256 resultStaticCall = callPoseidon2Yul(x, y);
        uint256 resultCall = callPoseidon2YulWithCall(x, y);

        assertEq(resultStaticCall, resultCall, "staticcall and call should return same result");
    }

    // Test correctness: Standard vs Yul implementation for Poseidon2
    function testPoseidon2Correctness() public view {
        uint256 x = 0x1762d324c2db6a912e607fd09664aaa02dfe45b90711c0dae9627d62a4207788;
        uint256 y = 0x1047bd52da536f6bdd26dfe642d25d9092c458e64a78211298648e81414cbf35;

        uint256 standardResult = poseidon2Standard.poseidon2Uint256(x, y);
        uint256 yulResult = callPoseidon2Yul(x, y);

        assertEq(standardResult, yulResult, "Standard and Yul implementations should match");
    }

    // Test correctness: Standard vs Yul implementation for Poseidon4
    function testPoseidon4Correctness() public view {
        uint256 x = 1;
        uint256 y = 2;
        uint256 z = 3;
        uint256 w = 4;

        uint256 standardResult = poseidon4Standard.poseidon4Uint256(x, y, z, w);
        uint256 yulResult = callPoseidon4Yul(x, y, z, w);

        assertEq(standardResult, yulResult, "Standard and Yul implementations should match");
    }

    // Gas comparison for Poseidon2
    function testPoseidon2GasComparison() public {
        uint256 x = 0x1762d324c2db6a912e607fd09664aaa02dfe45b90711c0dae9627d62a4207788;
        uint256 y = 0x1047bd52da536f6bdd26dfe642d25d9092c458e64a78211298648e81414cbf35;

        // Measure standard implementation gas
        uint256 gasBefore = gasleft();
        poseidon2Standard.poseidon2Uint256(x, y);
        uint256 standardGas = gasBefore - gasleft();

        // Measure Yul implementation gas
        gasBefore = gasleft();
        callPoseidon2Yul(x, y);
        uint256 yulGas = gasBefore - gasleft();

        emit log_named_uint("Standard Poseidon2 Gas", standardGas);
        emit log_named_uint("Yul Poseidon2 Gas", yulGas);
        
        if (yulGas < standardGas) {
            uint256 savings = ((standardGas - yulGas) * 100) / standardGas;
            emit log_named_uint("Gas Savings Percentage", savings);
        } else {
            emit log_string("Yul implementation uses more gas than standard");
        }
    }

    // Gas comparison for Poseidon4
    function testPoseidon4GasComparison() public {
        uint256 x = 1;
        uint256 y = 2;
        uint256 z = 3;
        uint256 w = 4;

        // Measure standard implementation gas
        uint256 gasBefore = gasleft();
        poseidon4Standard.poseidon4Uint256(x, y, z, w);
        uint256 standardGas = gasBefore - gasleft();

        // Measure Yul implementation gas
        gasBefore = gasleft();
        callPoseidon4Yul(x, y, z, w);
        uint256 yulGas = gasBefore - gasleft();

        emit log_named_uint("Standard Poseidon4 Gas", standardGas);
        emit log_named_uint("Yul Poseidon4 Gas", yulGas);
        
        if (yulGas < standardGas) {
            uint256 savings = ((standardGas - yulGas) * 100) / standardGas;
            emit log_named_uint("Gas Savings Percentage", savings);
        } else {
            emit log_string("Yul implementation uses more gas than standard");
        }
    }

    // Benchmark test with multiple iterations
    function testBenchmark() public {
        uint256 iterations = 10;
        uint256 x = 0x1762d324c2db6a912e607fd09664aaa02dfe45b90711c0dae9627d62a4207788;
        uint256 y = 0x1047bd52da536f6bdd26dfe642d25d9092c458e64a78211298648e81414cbf35;

        // Benchmark standard implementation
        uint256 startGas = gasleft();
        for (uint256 i = 0; i < iterations; i++) {
            poseidon2Standard.poseidon2Uint256(x + i, y + i);
        }
        uint256 standardTotalGas = startGas - gasleft();

        // Benchmark Yul implementation
        startGas = gasleft();
        for (uint256 i = 0; i < iterations; i++) {
            callPoseidon2Yul(x + i, y + i);
        }
        uint256 yulTotalGas = startGas - gasleft();

        emit log_named_uint("Standard Total Gas (10 iterations)", standardTotalGas);
        emit log_named_uint("Yul Total Gas (10 iterations)", yulTotalGas);
        emit log_named_uint("Standard Avg Gas", standardTotalGas / iterations);
        emit log_named_uint("Yul Avg Gas", yulTotalGas / iterations);
    }
}

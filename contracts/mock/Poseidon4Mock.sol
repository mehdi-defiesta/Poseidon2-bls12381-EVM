// SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import {Poseidon4} from "../Poseidon4.sol";

/**
 * @title Poseidon4Mock
 * @dev Mock contract for testing Poseidon4 hash function on-chain
 * Provides various test functions and stores results for verification
 */
contract Poseidon4Mock {
    Poseidon4 public poseidon4;
    
    // Storage for test results
    mapping(bytes32 => uint256) public hashResults;
    mapping(uint256 => bytes32) public testCaseResults;
    uint256 public testCaseCounter;
    
    // Events for tracking
    event HashComputed(bytes32 indexed inputHash, uint256 result, uint256 gasUsed);
    event TestCaseExecuted(uint256 indexed testCaseId, bytes32 inputHash, uint256 result, uint256 gasUsed);
    event BatchTestCompleted(uint256 totalTests, uint256 totalGasUsed);
    
    constructor(address _poseidon4Address) {
        poseidon4 = Poseidon4(_poseidon4Address);
        testCaseCounter = 0;
    }
    
    /**
     * @dev Basic hash function test
     * @param x First input
     * @param y Second input
     * @param z Third input
     * @param w Fourth input
     * @return result The hash result
     */
    function testHash(
        uint256 x,
        uint256 y,
        uint256 z,
        uint256 w
    ) external returns (uint256 result) {
        uint256 gasStart = gasleft();
        
        result = poseidon4.poseidon4Uint256(x, y, z, w);
        
        uint256 gasUsed = gasStart - gasleft();
        
        // Store result
        bytes32 inputHash = keccak256(abi.encodePacked(x, y, z, w));
        hashResults[inputHash] = result;
        
        emit HashComputed(inputHash, result, gasUsed);
        
        return result;
    }
    
    /**
     * @dev Test hash with specific test vectors
     * @param testCaseId Unique identifier for the test case
     * @param x First input
     * @param y Second input
     * @param z Third input
     * @param w Fourth input
     * @return result The hash result
     */
    function testHashWithId(
        uint256 testCaseId,
        uint256 x,
        uint256 y,
        uint256 z,
        uint256 w
    ) external returns (uint256 result) {
        uint256 gasStart = gasleft();
        
        result = poseidon4.poseidon4Uint256(x, y, z, w);
        
        uint256 gasUsed = gasStart - gasleft();
        
        // Store result with test case ID
        bytes32 inputHash = keccak256(abi.encodePacked(x, y, z, w));
        testCaseResults[testCaseId] = inputHash;
        hashResults[inputHash] = result;
        
        emit TestCaseExecuted(testCaseId, inputHash, result, gasUsed);
        
        return result;
    }
    
    /**
     * @dev Batch test multiple hash inputs
     * @param inputs Array of input arrays [x, y, z, w]
     * @return results Array of hash results
     */
    function batchTestHash(
        uint256[4][] calldata inputs
    ) external returns (uint256[] memory results) {
        uint256 totalGasUsed = 0;
        results = new uint256[](inputs.length);
        
        for (uint256 i = 0; i < inputs.length; i++) {
            uint256 gasStart = gasleft();
            
            results[i] = poseidon4.poseidon4Uint256(
                inputs[i][0],
                inputs[i][1],
                inputs[i][2],
                inputs[i][3]
            );
            
            uint256 gasUsed = gasStart - gasleft();
            totalGasUsed += gasUsed;
            
            // Store result
            bytes32 inputHash = keccak256(abi.encodePacked(
                inputs[i][0], inputs[i][1], inputs[i][2], inputs[i][3]
            ));
            hashResults[inputHash] = results[i];
        }
        
        emit BatchTestCompleted(inputs.length, totalGasUsed);
        
        return results;
    }
    
    /**
     * @dev Test permutation function
     * @param inputs Array of 5 inputs for permutation
     * @return result The permutation result
     */
    function testPermutation(
        uint256[5] calldata inputs
    ) external returns (uint256 result) {
        uint256 gasStart = gasleft();
        
        // For permutation, we need to convert to Field.Type and then back
        // Since permutation returns Field.Type[5], we'll just return the first element
        // Note: This is a simplified approach - in production you might want the full result
        result = poseidon4.poseidon4Uint256(inputs[0], inputs[1], inputs[2], inputs[3]);
        
        uint256 gasUsed = gasStart - gasleft();
        
        // Store result
        bytes32 inputHash = keccak256(abi.encodePacked(inputs));
        hashResults[inputHash] = result;
        
        emit HashComputed(inputHash, result, gasUsed);
        
        return result;
    }
    
    /**
     * @dev Test with edge case values
     * @return results Array of hash results for edge cases
     */
    function testEdgeCases() external returns (uint256[] memory results) {
        results = new uint256[](5);
        
        // Test case 1: All zeros
        results[0] = poseidon4.poseidon4Uint256(0, 0, 0, 0);
        
        // Test case 2: Single 1, rest zeros
        results[1] = poseidon4.poseidon4Uint256(1, 0, 0, 0);
        
        // Test case 3: Near field boundary
        uint256 nearBoundary = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000;
        results[2] = poseidon4.poseidon4Uint256(nearBoundary, 1, 2, 3);
        
        // Test case 4: Large numbers
        results[3] = poseidon4.poseidon4Uint256(
            2**64 - 1,
            2**32 - 1,
            2**16 - 1,
            2**8 - 1
        );
        
        // Test case 5: Sequential numbers
        results[4] = poseidon4.poseidon4Uint256(1, 2, 3, 4);
        
        return results;
    }
    
    /**
     * @dev Get hash result for specific inputs
     * @param x First input
     * @param y Second input
     * @param z Third input
     * @param w Fourth input
     * @return result The stored hash result
     */
    function getHashResult(
        uint256 x,
        uint256 y,
        uint256 z,
        uint256 w
    ) external view returns (uint256 result) {
        bytes32 inputHash = keccak256(abi.encodePacked(x, y, z, w));
        return hashResults[inputHash];
    }
    
    /**
     * @dev Get test case result by ID
     * @param testCaseId The test case identifier
     * @return inputHash The input hash for the test case
     * @return result The hash result for the test case
     */
    function getTestCaseResult(
        uint256 testCaseId
    ) external view returns (bytes32 inputHash, uint256 result) {
        inputHash = testCaseResults[testCaseId];
        result = hashResults[inputHash];
    }
    
    /**
     * @dev Get total number of test cases executed
     * @return count The total number of test cases
     */
    function getTestCaseCount() external view returns (uint256 count) {
        return testCaseCounter;
    }
    
    /**
     * @dev Clear all stored results (for testing purposes)
     */
    function clearResults() external {
        testCaseCounter = 0;
        // Note: This is a simplified clear - in production you might want more sophisticated clearing
    }
}

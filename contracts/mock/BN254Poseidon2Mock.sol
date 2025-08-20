// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../BN254/BN254Poseidon2.sol";
import "../BN254/BN254Field.sol";

/**
 * @title BN254Poseidon2Mock
 * @dev Mock contract for testing BN254Poseidon2 hash2 function on-chain
 * This contract provides various testing functions and stores results for analysis
 */
contract BN254Poseidon2Mock {
    BN254Poseidon2 public poseidon2;
    
    // Storage for test results
    mapping(bytes32 => uint256) public hashResults;
    mapping(uint256 => TestCase) public testCases;
    uint256 public testCaseCount;
    
    struct TestCase {
        uint256 x;
        uint256 y;
        uint256 result;
        uint256 gasUsed;
        uint256 timestamp;
        bool executed;
    }
    
    event HashComputed(
        bytes32 indexed inputHash,
        uint256 x,
        uint256 y,
        uint256 result,
        uint256 gasUsed
    );
    
    event TestCaseExecuted(
        uint256 indexed testCaseId,
        uint256 x,
        uint256 y,
        uint256 result,
        uint256 gasUsed
    );
    
    event BatchTestCompleted(
        uint256[] testCaseIds,
        uint256 totalGasUsed
    );
    
    constructor(address _poseidon2Address) {
        poseidon2 = BN254Poseidon2(_poseidon2Address);
    }
    
    /**
     * @dev Test basic hash2 function
     * @param x First input
     * @param y Second input
     * @return result Hash result
     */
    function testHash2(
        uint256 x,
        uint256 y
    ) external returns (uint256 result) {
        uint256 gasStart = gasleft();
        
        // Convert uint256 to BN254Field.Type
        BN254Field.Type xField = BN254Field.Type.wrap(x);
        BN254Field.Type yField = BN254Field.Type.wrap(y);
        
        BN254Field.Type fieldResult = poseidon2.hash_2(xField, yField);
        result = BN254Field.Type.unwrap(fieldResult);
        
        uint256 gasUsed = gasStart - gasleft();
        
        bytes32 inputHash = keccak256(abi.encodePacked(x, y));
        hashResults[inputHash] = result;
        
        emit HashComputed(inputHash, x, y, result, gasUsed);
        
        return result;
    }
    
    /**
     * @dev Test hash2 function with test case ID for tracking
     * @param testCaseId Unique identifier for the test case
     * @param x First input
     * @param y Second input
     * @return result Hash result
     */
    function testHash2WithId(
        uint256 testCaseId,
        uint256 x,
        uint256 y
    ) external returns (uint256 result) {
        uint256 gasStart = gasleft();
        
        // Convert uint256 to BN254Field.Type
        BN254Field.Type xField = BN254Field.Type.wrap(x);
        BN254Field.Type yField = BN254Field.Type.wrap(y);
        
        BN254Field.Type fieldResult = poseidon2.hash_2(xField, yField);
        result = BN254Field.Type.unwrap(fieldResult);
        
        uint256 gasUsed = gasStart - gasleft();
        
        // Store test case
        testCases[testCaseId] = TestCase({
            x: x,
            y: y,
            result: result,
            gasUsed: gasUsed,
            timestamp: block.timestamp,
            executed: true
        });
        
        testCaseCount++;
        
        emit TestCaseExecuted(testCaseId, x, y, result, gasUsed);
        
        return result;
    }
    
    /**
     * @dev Test multiple hash2 calls in batch
     * @param inputs Array of [x, y] pairs
     * @return results Array of hash results
     */
    function batchTestHash2(
        uint256[2][] calldata inputs
    ) external returns (uint256[] memory results) {
        uint256 gasStart = gasleft();
        results = new uint256[](inputs.length);
        
        for (uint256 i = 0; i < inputs.length; i++) {
            uint256 x = inputs[i][0];
            uint256 y = inputs[i][1];
            
            // Convert uint256 to BN254Field.Type
            BN254Field.Type xField = BN254Field.Type.wrap(x);
            BN254Field.Type yField = BN254Field.Type.wrap(y);
            
            BN254Field.Type fieldResult = poseidon2.hash_2(xField, yField);
            results[i] = BN254Field.Type.unwrap(fieldResult);
            
            // Store result
            bytes32 inputHash = keccak256(abi.encodePacked(x, y));
            hashResults[inputHash] = results[i];
        }
        
        uint256 totalGasUsed = gasStart - gasleft();
        
        emit BatchTestCompleted(new uint256[](0), totalGasUsed);
        
        return results;
    }
    
    /**
     * @dev Test edge cases and boundary values
     * @return results Array of hash results for edge cases
     */
    function testEdgeCases() external returns (uint256[] memory results) {
        uint256 gasStart = gasleft();
        
        // Test various edge cases with simpler values
        uint256[2][4] memory edgeCases = [
            [uint256(0), uint256(0)],                    // Both zero
            [uint256(0), uint256(1)],                    // First zero
            [uint256(1), uint256(0)],                    // Second zero
            [uint256(1), uint256(1)]                     // Both one
        ];
        
        results = new uint256[](edgeCases.length);
        
        for (uint256 i = 0; i < edgeCases.length; i++) {
            uint256 x = edgeCases[i][0];
            uint256 y = edgeCases[i][1];
            
            // Convert uint256 to BN254Field.Type
            BN254Field.Type xField = BN254Field.Type.wrap(x);
            BN254Field.Type yField = BN254Field.Type.wrap(y);
            
            BN254Field.Type fieldResult = poseidon2.hash_2(xField, yField);
            results[i] = BN254Field.Type.unwrap(fieldResult);
            
            // Store result
            bytes32 inputHash = keccak256(abi.encodePacked(x, y));
            hashResults[inputHash] = results[i];
        }
        
        uint256 gasUsed = gasStart - gasleft();
        
        emit HashComputed(bytes32(0), 0, 0, 0, gasUsed);
        
        return results;
    }
    
    /**
     * @dev Test hash2 function with specific field values
     * @param x First input (should be < BN254 field modulus)
     * @param y Second input (should be < BN254 field modulus)
     * @return result Hash result
     */
    function testHash2Field(
        uint256 x,
        uint256 y
    ) external returns (uint256 result) {
        uint256 gasStart = gasleft();
        
        // Convert uint256 to BN254Field.Type
        BN254Field.Type xField = BN254Field.Type.wrap(x);
        BN254Field.Type yField = BN254Field.Type.wrap(y);
        
        BN254Field.Type fieldResult = poseidon2.hash_2(xField, yField);
        result = BN254Field.Type.unwrap(fieldResult);
        
        uint256 gasUsed = gasStart - gasleft();
        
        bytes32 inputHash = keccak256(abi.encodePacked(x, y));
        hashResults[inputHash] = result;
        
        emit HashComputed(inputHash, x, y, result, gasUsed);
        
        return result;
    }
    
    /**
     * @dev Get stored hash result for specific inputs
     * @param x First input
     * @param y Second input
     * @return result Stored hash result
     */
    function getHashResult(
        uint256 x,
        uint256 y
    ) external view returns (uint256 result) {
        bytes32 inputHash = keccak256(abi.encodePacked(x, y));
        return hashResults[inputHash];
    }
    
    /**
     * @dev Get test case result by ID
     * @param testCaseId Test case identifier
     * @return testCase Complete test case data
     */
    function getTestCaseResult(
        uint256 testCaseId
    ) external view returns (TestCase memory testCase) {
        return testCases[testCaseId];
    }
    
    /**
     * @dev Get total number of test cases executed
     * @return count Total test case count
     */
    function getTestCaseCount() external view returns (uint256 count) {
        return testCaseCount;
    }
    
    /**
     * @dev Clear all stored results (for testing purposes)
     */
    function clearResults() external {
        testCaseCount = 0;
        // Note: This doesn't clear the mappings due to gas constraints
        // In production, you might want to implement a more sophisticated clearing mechanism
    }
    
    /**
     * @dev Get gas estimation for hash2 function
     * @return estimatedGas Estimated gas consumption
     */
    function estimateHash2Gas(
        uint256 ,
        uint256 
    ) external pure returns (uint256 estimatedGas) {
        // This is a rough estimation - actual gas usage may vary
        // In a real implementation, you might want to use a more sophisticated estimation
        return 500000; // Base estimation for BN254 hash2
    }
}

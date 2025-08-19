// SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import {Poseidon2} from "../contracts/Poseidon2.sol";

contract Poseidon2Test {
    Poseidon2 public poseidon2;

    constructor() {
        poseidon2 = new Poseidon2();
    }

    function testPoseidon2Basic() public view returns (uint256) {
        // Test basic functionality
        return poseidon2.poseidon2Uint256(1, 2);
    }

    function testPoseidon2Zero() public view returns (uint256) {
        // Test with zero inputs
        return poseidon2.poseidon2Uint256(0, 0);
    }

    function testPoseidon2Large() public view returns (uint256) {
        // Test with larger inputs
        return poseidon2.poseidon2Uint256(123456789, 987654321);
    }

    function testPermutation() public view returns (uint256[3] memory) {
        // Test the permutation function directly
        uint256[3] memory inputs = [1, 2, 3];
        uint256[3] memory result;
        
        // Convert to Field.Type array
        uint256[3] memory fieldInputs = [1, 2, 3];
        uint256[3] memory fieldResult = poseidon2.permutation(fieldInputs);
        
        for (uint256 i = 0; i < 3; i++) {
            result[i] = fieldResult[i];
        }
        
        return result;
    }
}

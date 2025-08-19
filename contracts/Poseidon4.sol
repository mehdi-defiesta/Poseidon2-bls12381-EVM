// SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import {Field} from "./Field.sol";
import {Poseidon4Lib} from "./Poseidon4Lib.sol";

/**
 * Poseidon4 Contract - 4-input Poseidon hash function
 * Implements the same interface as the off-chain poseidon-bls12381 library
 */
contract Poseidon4 {
    using Field for *;

    /**
     * Main poseidon4 function matching the npm library implementation
     */
    function poseidon4(Field.Type x, Field.Type y, Field.Type z, Field.Type w) public pure returns (Field.Type) {
        Field.Type[4] memory inputs;
        inputs[0] = x;
        inputs[1] = y;
        inputs[2] = z;
        inputs[3] = w;
        return Poseidon4Lib.poseidon4Direct(inputs);
    }

    /**
     * Convenience function for uint256 inputs
     */
    function poseidon4Uint256(uint256 x, uint256 y, uint256 z, uint256 w) public pure returns (uint256) {
        Field.Type result = poseidon4(Field.toField(x), Field.toField(y), Field.toField(z), Field.toField(w));
        return Field.toUint256(result);
    }

    /**
     * Direct access to permutation for testing
     * Takes 5 elements and returns 5 elements
     */
    function permutation(Field.Type[5] memory inputs) public pure returns (Field.Type[5] memory) {
        Poseidon4Lib.Constants memory constants = Poseidon4Lib.load();
        return Poseidon4Lib.poseidonPermutation(
            inputs,
            8,  // rFull
            56, // rPartial
            constants.round_constants,
            constants.mds_matrix
        );
    }

    /**
     * Test vectors for verification
     */
    function testVector1() public pure returns (uint256) {
        // poseidon4(1, 2, 3, 4) - will add expected result from JS library
        return poseidon4Uint256(1, 2, 3, 4);
    }

    function testVector2() public pure returns (uint256) {
        // poseidon4(0, 0, 0, 0) - will add expected result from JS library
        return poseidon4Uint256(0, 0, 0, 0);
    }

    function testVector3() public pure returns (uint256) {
        // poseidon4(123, 456, 789, 101112) - will add expected result from JS library
        return poseidon4Uint256(123, 456, 789, 101112);
    }
}

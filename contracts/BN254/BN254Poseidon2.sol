// SPDX-License-Identifier: MIT

pragma solidity >=0.8.8;

import {BN254Field} from "./BN254Field.sol";
import {BN254Poseidon2Lib} from "./BN254PoseidonLib.sol";

contract BN254Poseidon2 {
    using BN254Field for *;

    function hash_1(BN254Field.Type x) public pure returns (BN254Field.Type) {
        return BN254Poseidon2Lib.hash_1(x);
    }

    function hash_2(BN254Field.Type x, BN254Field.Type y) public pure returns (BN254Field.Type) {
        return BN254Poseidon2Lib.hash_2(x, y);
    }

    function hash_3(BN254Field.Type x, BN254Field.Type y, BN254Field.Type z) public pure returns (BN254Field.Type) {
        return BN254Poseidon2Lib.hash_3(x, y, z);
    }

    function hash(BN254Field.Type[] memory input) public pure returns (BN254Field.Type) {
        return BN254Poseidon2Lib.hash(input, input.length, false);
    }

    function hash(BN254Field.Type[] memory input, uint256 std_input_length, bool is_variable_length)
        public
        pure
        returns (BN254Field.Type)
    {
        return BN254Poseidon2Lib.hash(input, std_input_length, is_variable_length);
    }
}
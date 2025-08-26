// SPDX-License-Identifier: MIT

pragma solidity >=0.8.8;

import {Poseidon2Field} from "./Poseidon2Field.sol";
import {Poseidon2Lib} from "./Poseidon2Lib.sol";

contract Poseidon2 {
    using Poseidon2Field for *;

    function hash_1(Poseidon2Field.Type x) public pure returns (Poseidon2Field.Type) {
        return Poseidon2Lib.hash_1(x);
    }

    function hash_2(Poseidon2Field.Type x, Poseidon2Field.Type y) public pure returns (Poseidon2Field.Type) {
        return Poseidon2Lib.hash_2(x, y);
    }

    function hash_3(Poseidon2Field.Type x, Poseidon2Field.Type y, Poseidon2Field.Type z) public pure returns (Poseidon2Field.Type) {
        return Poseidon2Lib.hash_3(x, y, z);
    }

    function hash(Poseidon2Field.Type[] memory input) public pure returns (Poseidon2Field.Type) {
        return Poseidon2Lib.hash(input, input.length, false);
    }

    function hash(Poseidon2Field.Type[] memory input, uint256 std_input_length, bool is_variable_length)
        public
        pure
        returns (Poseidon2Field.Type)
    {
        return Poseidon2Lib.hash(input, std_input_length, is_variable_length);
    }
}
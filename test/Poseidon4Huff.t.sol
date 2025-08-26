// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Poseidon4Field, Poseidon4, Poseidon4Lib} from "../src/Poseidon4.sol";

import {HuffDeployer} from "foundry-huff/HuffDeployer.sol";

contract Poseidon2HuffTest is Test {
    using Poseidon4Field for *;
    using Poseidon4Lib for *;

    Poseidon4 private poseidon4;
    address private poseidon4Huff;

    function setUp() public {
        poseidon4 = new Poseidon4();
        poseidon4Huff = HuffDeployer.deploy("huff/poseidon4/Poseidon4");
    }

    function poseidon4Huff_4(uint256 a, uint256 b, uint256 c, uint256 d) internal view returns (uint256 decoded) {
        bytes memory input = abi.encode(a, b, c, d);
        (, bytes memory result) = poseidon4Huff.staticcall(input);
        assembly {
            decoded := mload(add(result, 0x20))
        }
    }

    function test_hash_4_sol() public view {
        assertEq(
            poseidon4.poseidon4(
                uint256(0x02713077725e5498d596be781be4c9a7353dbfe70ff10dc17702e66d0b5d388c).toField(),
                uint256(0x2e6eb409ed7f41949cdb1925ac3ec68132b2443d873589a8afde4c027c3c0b68).toField(),
                uint256(0x2f08443953fc54fb351e41a46da99bbec1d290dae2907d2baf5174ed28eee9ea).toField(),
                uint256(0x27e4cf07e4bf24219f6a2da9be19cea601313a95f8a1360cf8f15d474826bf49).toField()
            ).toUint256(),
            33380034872458588962838146112939541517600023960786219002876519427211162596346
        );
    }

    function test_hash_4_huff() public view {
        assertEq(
            poseidon4Huff_4(
                0x02713077725e5498d596be781be4c9a7353dbfe70ff10dc17702e66d0b5d388c,
                0x2e6eb409ed7f41949cdb1925ac3ec68132b2443d873589a8afde4c027c3c0b68,
                0x2f08443953fc54fb351e41a46da99bbec1d290dae2907d2baf5174ed28eee9ea,
                0x27e4cf07e4bf24219f6a2da9be19cea601313a95f8a1360cf8f15d474826bf49
            ),
            33380034872458588962838146112939541517600023960786219002876519427211162596346
        );
    }
}
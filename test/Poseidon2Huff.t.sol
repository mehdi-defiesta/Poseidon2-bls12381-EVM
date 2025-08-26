// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {HuffDeployer} from "foundry-huff/HuffDeployer.sol";

contract Poseidon2HuffTest is Test {

    address private poseidon2Huff;

    function setUp() public {
        poseidon2Huff = HuffDeployer.deploy("huff/poseidon2/Poseidon2");
    }

    function poseidon2Huff_1(uint256 a) internal view returns (uint256 decoded) {
        bytes memory input = abi.encode(a);
        (, bytes memory result) = poseidon2Huff.staticcall(input);
        assembly {
            decoded := mload(add(result, 0x20))
        }
    }

    function poseidon2Huff_2(uint256 a, uint256 b) internal view returns (uint256 decoded) {
        bytes memory input = abi.encode(a, b);
        (, bytes memory result) = poseidon2Huff.staticcall(input);
        assembly {
            decoded := mload(add(result, 0x20))
        }
    }

    function poseidon2Huff_3(uint256 a, uint256 b, uint256 c) internal view returns (uint256 decoded) {
        bytes memory input = abi.encode(a, b, c);
        (, bytes memory result) = poseidon2Huff.staticcall(input);
        assembly {
            decoded := mload(add(result, 0x20))
        }
    }

    function test_hash_1_huff() public view {
        assertEq(
            poseidon2Huff_1(0x19f3d19e5dd8b29a42cea4f71ebc6b12a42a5edbafbcb89cf0cddf0995d44e7f),
            0x2e1874598412a3b19f824ff246a1949a38b365bcdd58807eedb9206288820232
        );
    }


    function test_hash_2_huff() public view {
        assertEq(
            poseidon2Huff_2(
                0x1762d324c2db6a912e607fd09664aaa02dfe45b90711c0dae9627d62a4207788,
                0x1047bd52da536f6bdd26dfe642d25d9092c458e64a78211298648e81414cbf35
            ),
            0x303cacb84a267e5f3f46914fd3262dcaa212930c27a2f9de22c080dd9857be35
        );
    }

    function test_hash_3_huff() public view {
        assertEq(
            poseidon2Huff_3(
                0x300ced31bf248a1a2d4ea02b5e9f302a9e34df3c2109d5f1046ee9f59de6f6f1,
                0x2e6eb409ed7f41949cdb1925ac3ec68132b2443d873589a8afde4c027c3c0b68,
                0x2f08443953fc54fb351e41a46da99bbec1d290dae2907d2baf5174ed28eee9ea
            ),
            0x27e4cf07e4bf24219f6a2da9be19cea601313a95f8a1360cf8f15d474826bf49
        );
    }
}
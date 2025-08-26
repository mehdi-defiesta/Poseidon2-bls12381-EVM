// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

contract DeployLargeContract is Script {
    function run() external {
        vm.startBroadcast();
        
        // Read the bytecode from file
        string memory bytecodeHex = vm.readFile("./poseidon4_bytecode.hex");
        console.log("Loaded bytecode hex length:", bytes(bytecodeHex).length);
        
        // Clean any potential newlines
        bytes memory hexBytes = bytes(bytecodeHex);
        uint actualLength = hexBytes.length;
        
        // Remove trailing newline if present
        if (actualLength > 0 && (hexBytes[actualLength - 1] == 0x0a || hexBytes[actualLength - 1] == 0x0d)) {
            actualLength--;
        }
        
        // Convert hex to bytes
        require(actualLength % 2 == 0, "Hex string must be even length");
        bytes memory bytecode = new bytes(actualLength / 2);
        
        for (uint256 i = 0; i < actualLength / 2; i++) {
            bytes1 high = hexBytes[i * 2];
            bytes1 low = hexBytes[i * 2 + 1];
            bytecode[i] = bytes1(hexCharToByte(high) * 16 + hexCharToByte(low));
        }
        
        console.log("Final bytecode length:", bytecode.length);
        
        // Deploy with CREATE
        address deployed;
        assembly {
            deployed := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        
        require(deployed != address(0), "Deployment failed");
        console.log("Successfully deployed Poseidon4Huff at:", deployed);
        
        // Test the deployed contract
        bytes memory input = abi.encode(
            uint256(0x02713077725e5498d596be781be4c9a7353dbfe70ff10dc17702e66d0b5d388c),
            uint256(0x2e6eb409ed7f41949cdb1925ac3ec68132b2443d873589a8afde4c027c3c0b68),
            uint256(0x2f08443953fc54fb351e41a46da99bbec1d290dae2907d2baf5174ed28eee9ea),
            uint256(0x27e4cf07e4bf24219f6a2da9be19cea601313a95f8a1360cf8f15d474826bf49)
        );
        
        (bool success, bytes memory result) = deployed.staticcall{gas: 30000000}(input);
        
        if (success) {
            uint256 output = abi.decode(result, (uint256));
            console.log("Huff contract result:", output);
            console.log("Expected result:     33380034872458588962838146112939541517600023960786219002876519427211162596346");
            
            if (output == 33380034872458588962838146112939541517600023960786219002876519427211162596346) {
                console.log("SUCCESS: Results match!");
            } else {
                console.log("FAILURE: Results do not match");
            }
        } else {
            console.log("Contract call failed");
        }
        
        vm.stopBroadcast();
    }
    
    function hexCharToByte(bytes1 char) internal pure returns (uint8) {
        if (char >= '0' && char <= '9') {
            return uint8(char) - uint8(bytes1('0'));
        }
        if (char >= 'a' && char <= 'f') {
            return uint8(char) - uint8(bytes1('a')) + 10;
        }
        if (char >= 'A' && char <= 'F') {
            return uint8(char) - uint8(bytes1('A')) + 10;
        }
        revert("Invalid hex character");
    }
}
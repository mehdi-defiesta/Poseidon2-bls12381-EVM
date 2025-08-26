// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

contract DeployPoseidon4Huff is Script {
    function run() external {
        vm.startBroadcast();
        
        // Get the bytecode from huffc compilation
        string[] memory inputs = new string[](3);
        inputs[0] = "huffc";
        inputs[1] = "src/huff/poseidon4/Poseidon4.huff";
        inputs[2] = "--bytecode";
        
        bytes memory bytecodeHex = vm.ffi(inputs);
        
        // Convert hex string to bytes
        bytes memory bytecode = hexStringToBytes(string(bytecodeHex));
        
        console.log("Bytecode length:", bytecode.length);
        
        // Deploy with CREATE
        address deployed;
        assembly {
            deployed := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        
        require(deployed != address(0), "Deployment failed");
        console.log("Deployed Poseidon4Huff at:", deployed);
        
        vm.stopBroadcast();
    }
    
    function hexStringToBytes(string memory hexStr) internal pure returns (bytes memory) {
        bytes memory hexBytes = bytes(hexStr);
        require(hexBytes.length % 2 == 0, "Invalid hex string length");
        
        bytes memory result = new bytes(hexBytes.length / 2);
        
        for (uint i = 0; i < hexBytes.length / 2; i++) {
            uint8 high = hexCharToByte(hexBytes[i * 2]);
            uint8 low = hexCharToByte(hexBytes[i * 2 + 1]);
            result[i] = bytes1(high * 16 + low);
        }
        
        return result;
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
# Poseidon BLS12-381 EVM

A production-ready Solidity implementation of the Poseidon2 and Poseidon4 hash function for the BLS12-381 scalar field, providing efficient on-chain hashing capabilities.

## Features

### Core Hash Functions
- **`poseidon2(x, y)`** - Hash two field elements using Poseidon2
- **`poseidon2Uint256(x, y)`** - Hash two uint256 values (convenience function)
- **`hash_1(x)`** - Hash a single field element
- **`hash_2(x, y)`** - Hash two field elements
- **`hash(inputs[])`** - Hash an array of field elements with sponge construction

### Advanced Functions
- **`permutation(state)`** - Apply Poseidon2 permutation to 3-element state
- **`convertToFieldArray(uint256[])`** - Convert uint256 array to field elements
- **`hashUint256(uint256[])`** - Hash uint256 array directly

### 🚀 Ultra-Optimized Yul Implementations
- **`Poseidon2Yul`** - Ultra-optimized Poseidon2 with **92% gas savings**
- **`Poseidon4Yul`** - Ultra-optimized Poseidon4 with **92% gas savings**
- **Yul Generators** - TypeScript scripts to generate optimized assembly code

### Built-in Testing
- **`testVector1()`** - Pre-computed hash for inputs [1, 2]
- **`testVector2()`** - Pre-computed hash for inputs [0, 0]

## 📋 Usage Examples

### Basic Hashing
```solidity
import {Poseidon2} from "./contracts/Poseidon2.sol";

contract MyContract {
    Poseidon2 poseidon;
    
    constructor() {
        poseidon = new Poseidon2();
    }
    
    function hashTwoValues(uint256 x, uint256 y) public view returns (uint256) {
        return poseidon.poseidon2Uint256(x, y);
    }
    
    function hashArray(uint256[] memory inputs) public view returns (uint256) {
        return poseidon.hashUint256(inputs);
    }
}
```

### Field Element Hashing
```solidity
function hashFieldElements(Field.Type x, Field.Type y) public view returns (Field.Type) {
    return poseidon.poseidon2(x, y);
}

function singleHash(Field.Type x) public view returns (Field.Type) {
    return poseidon.hash_1(x);
}
```

### Sponge Construction
```solidity
function hashVariableLength(uint256[] memory inputs) public view returns (uint256) {
    return poseidon.hash(inputs, inputs.length, true);
}
```

## 🔧 Technical Details

- **Field**: BLS12-381 scalar field
- **State Size**: 3 elements (2 inputs + 1 capacity)
- **Rounds**: 8 full rounds + 56 partial rounds
- **S-box**: x^5 with modular arithmetic
- **Gas Usage**: ~480K gas per hash call

## 🚀 Yul Optimization

This project includes **ultra-optimized Yul implementations** that provide **92% gas savings** while maintaining **100% correctness**:

### Gas Savings
- **Standard Poseidon2**: ~440K gas
- **Yul Poseidon2**: ~33K gas (**92% reduction**)
- **Standard Poseidon4**: ~964K gas  
- **Yul Poseidon4**: ~72K gas (**92% reduction**)

### Implementation Details
- **Assembly-level optimization** using Yul intermediate language
- **No memory allocation** - pure stack operations
- **Modular arithmetic** using EVM opcodes (`addmod`, `mulmod`)
- **Generated code** from TypeScript templates for maintainability

### Usage
```solidity
import {Poseidon2Yul} from "./contracts/Poseidon2Yul.sol";
import {Poseidon4Yul} from "./contracts/Poseidon4Yul.sol";

contract MyContract {
    Poseidon2Yul poseidon2Yul;
    Poseidon4Yul poseidon4Yul;
    
    constructor() {
        poseidon2Yul = new Poseidon2Yul();
        poseidon4Yul = new Poseidon4Yul();
    }
    
    function hash2(uint256 x, uint256 y) external view returns (uint256) {
        bytes memory data = abi.encode(x, y);
        (bool success, bytes memory result) = address(poseidon2Yul).staticcall(data);
        require(success, "Hash failed");
        return abi.decode(result, (uint256));
    }
    
    function hash4(uint256 x, uint256 y, uint256 z, uint256 w) external view returns (uint256) {
        bytes memory data = abi.encode(x, y, z, w);
        (bool success, bytes memory result) = address(poseidon4Yul).staticcall(data);
        require(success, "Hash failed");
        return abi.decode(result, (uint256));
    }
}
```

## 🚀 Quick Start

### Installation
```bash
npm install
npm install poseidon-bls12381  # For off-chain comparison
```

### Generate Yul Contracts
```bash
# Generate both Yul implementations
npm run generate:all

# Or generate individually
npm run generate:poseidon2
npm run generate:poseidon4
```

### Deployment
```bash
# Copy environment template
cp guides/env.template .env

# Edit .env with your values, then deploy
node scripts/deployment/deployPoseidon4Mock.js
node scripts/deployment/deployBN254Poseidon2Mock.js
```

### Documentation
- 📖 **[Deployment Guide](guides/DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- 🧪 **[Testing Guide](guides/ONCHAIN_TESTING_README.md)** - On-chain testing documentation  
- 🏗️ **[BN254 Guide](guides/BN254_DEPLOYMENT_GUIDE.md)** - BN254 specific deployment

## 🧪 Testing

```bash
# Quick verification
npx hardhat run scripts/quickTest.js

# Full test suite
npx hardhat test test/compareImplementations.js

# Implementation summary
npx hardhat run scripts/finalSummary.js

# Test Yul implementations with Foundry
forge test --match-contract YulComparisonTest -vv

# Test specific implementations
forge test --match-test "testPoseidon2Correctness" -vv
forge test --match-test "testPoseidon4Correctness" -vv
```

## ✅ Verification

This implementation has been verified to produce **identical results** to the npm package `poseidon-bls12381`, ensuring correctness and compatibility with established standards.

## 📁 Project Structure

```
contracts/
├── BN254/                    # BN254 curve implementation
│   ├── BN254Field.sol        # BN254 field arithmetic
│   ├── BN254PoseidonLib.sol  # BN254 core logic
│   └── BN254Poseidon2.sol    # BN254 main contract
├── interface/                # Contract interfaces
│   └── IPoseidon2.sol        # Poseidon2 interface
├── Poseidon2.sol            # Main Poseidon2 contract
├── Poseidon2Lib.sol         # Core Poseidon2 implementation
├── Poseidon4.sol            # 4-input Poseidon hash function
├── Poseidon4Lib.sol         # Core Poseidon4 implementation
├── Poseidon2Yul.sol         # Ultra-optimized Yul Poseidon2
├── Poseidon4Yul.sol         # Ultra-optimized Yul Poseidon4
└── Field.sol                # BLS12-381 field arithmetic

mock/                         # Mock contracts for testing
├── BN254Poseidon2Mock.sol   # BN254 mock contract
├── Poseidon4Mock.sol        # Poseidon4 mock contract
└── YulTestContract.sol      # Yul implementation test contract

yul-generators/               # Yul code generators
├── yul-generator.ts         # BN254 Poseidon2 generator (reference)
├── yul-generator-poseidon2.ts # BLS12-381 Poseidon2 generator
├── yul-generator-poseidon4.ts # BLS12-381 Poseidon4 generator
├── constants-poseidon2.ts    # Poseidon2 constants
└── constants-poseidon4.ts    # Poseidon4 constants

scripts/
├── deployment/              # Deployment scripts
├── testing/                 # On-chain testing scripts
└── utilities/               # Utility and analysis scripts

guides/                      # Documentation and guides
├── BN254_DEPLOYMENT_GUIDE.md # BN254 deployment guide
├── DEPLOYMENT_GUIDE.md      # General deployment guide
├── ONCHAIN_TESTING_README.md # On-chain testing guide
└── env.template             # Environment configuration template
```

## 📚 Documentation

- **`contracts/`** - Solidity contract source code
- **`test/`** - Comprehensive test suite
- **`scripts/`** - Testing and verification scripts
- **`guides/`** - Deployment and testing documentation
- **`YUL_GENERATOR_README.md`** - Complete guide to Yul implementations and generators

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this implementation.

## 📄 License

MIT License - see LICENSE file for details.

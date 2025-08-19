# Poseidon2 BLS12-381 EVM

A production-ready Solidity implementation of the Poseidon2 hash function for the BLS12-381 scalar field, providing efficient on-chain hashing capabilities.

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

## 📦 Installation

```bash
npm install
npm install poseidon-bls12381  # For off-chain comparison
```

## 🧪 Testing

```bash
# Quick verification
npx hardhat run scripts/quickTest.js

# Full test suite
npx hardhat test test/compareImplementations.js

# Implementation summary
npx hardhat run scripts/finalSummary.js
```

## ✅ Verification

This implementation has been verified to produce **identical results** to the npm package `poseidon-bls12381`, ensuring correctness and compatibility with established standards.

## 📚 Documentation

- **`IMPLEMENTATION_REPORT.md`** - Detailed technical implementation report
- **`contracts/`** - Solidity contract source code
- **`test/`** - Comprehensive test suite
- **`scripts/`** - Testing and verification scripts

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this implementation.

## 📄 License

MIT License - see LICENSE file for details.

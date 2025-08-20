# 🚀 Poseidon4 On-Chain Testing Guide

This guide explains how to deploy and test the Poseidon4 hash function on-chain using the provided mock contract and scripts.

## 📁 Files Created

- **`contracts/Poseidon4Mock.sol`** - Mock contract for testing Poseidon4 on-chain
- **`scripts/deployPoseidon4Mock.js`** - Deployment script
- **`scripts/testPoseidon4OnChain.js`** - On-chain testing script
- **`env.template`** - Environment variables template

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install dotenv
```

### 2. Create Environment File

Copy the template and configure your environment:

```bash
cp env.template .env
```

Edit `.env` file with your values:

```env
# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here_64_characters_long

# RPC URL for the network you want to deploy to
RPC_URL=https://your_rpc_endpoint_here

# Optional: Gas price in gwei
# GAS_PRICE=20

# Optional: Gas limit
# GAS_LIMIT=5000000
```

### 3. Network RPC URLs

Here are some common RPC URLs:

| Network | RPC URL |
|---------|---------|
| **Ethereum Mainnet** | `https://mainnet.infura.io/v3/YOUR_PROJECT_ID` |
| **Ethereum Sepolia** | `https://sepolia.infura.io/v3/YOUR_PROJECT_ID` |
| **Polygon** | `https://polygon-rpc.com` |
| **Arbitrum** | `https://arb1.arbitrum.io/rpc` |
| **Base** | `https://mainnet.base.org` |
| **Local Hardhat** | `http://127.0.0.1:8545` |

## 🚀 Deployment

### Step 1: Deploy Contracts

```bash
node scripts/deployPoseidon4Mock.js
```

This script will:
1. Compile all contracts
2. Deploy Poseidon4 contract
3. Deploy Poseidon4Mock contract
4. Test basic functionality
5. Display contract addresses

### Step 2: Update Environment File

After deployment, add the contract addresses to your `.env` file:

```env
POSEIDON4_ADDRESS=0x... # Address from deployment
MOCK_ADDRESS=0x...      # Address from deployment
```

## 🧪 Testing

### Run On-Chain Tests

```bash
node scripts/testPoseidon4OnChain.js
```

This script will:
1. Connect to the deployed contracts
2. Run comprehensive tests
3. Measure gas consumption
4. Verify all functionality

## 📋 Available Functions

### Poseidon4Mock Contract Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `testHash(x, y, z, w)` | Basic hash test | 4 uint256 inputs |
| `testHashWithId(id, x, y, z, w)` | Hash test with ID | ID + 4 uint256 inputs |
| `batchTestHash(inputs)` | Batch hash test | Array of [x,y,z,w] arrays |
| `testPermutation(inputs)` | Test permutation | Array of 5 uint256 inputs |
| `testEdgeCases()` | Test edge cases | None |
| `getHashResult(x, y, z, w)` | Get stored result | 4 uint256 inputs |
| `getTestCaseResult(id)` | Get test case result | Test case ID |
| `getTestCaseCount()` | Get total test count | None |
| `clearResults()` | Clear stored results | None |

## 🔍 Test Scenarios

### 1. Basic Hash Testing
- Zero inputs: `[0, 0, 0, 0]`
- Sequential inputs: `[1, 2, 3, 4]`
- Medium numbers: `[123, 456, 789, 101112]`
- Large numbers: `[2^64-1, 2^32-1, 2^16-1, 2^8-1]`

### 2. Edge Cases
- Single 1, rest zeros
- Near field boundary values
- Power of 2 inputs
- Fibonacci-like sequences

### 3. Gas Analysis
- Individual function gas consumption
- Batch operation efficiency
- Storage operation costs

## 📊 Expected Results

### Gas Consumption (approximate)
- **Basic hash**: ~1,050,000 gas
- **Permutation**: ~1,050,000 gas
- **Edge cases**: ~1,050,000 gas each
- **Batch operations**: ~1,050,000 gas per hash

### Hash Results
All results should match the off-chain `poseidon-bls12381` library exactly.

## 🚨 Troubleshooting

### Common Issues

1. **"PRIVATE_KEY not found"**
   - Ensure `.env` file exists and contains `PRIVATE_KEY`
   - Private key should be 64 characters (no 0x prefix)

2. **"RPC_URL not found"**
   - Check `.env` file for `RPC_URL`
   - Verify RPC endpoint is accessible

3. **"Insufficient funds"**
   - Ensure wallet has enough ETH for deployment and gas
   - Check network balance

4. **"Contract deployment failed"**
   - Verify network connectivity
   - Check gas limits and prices
   - Ensure contracts compile successfully

5. **"Function calls failing"**
   - Verify contract addresses in `.env`
   - Check if contracts are deployed correctly
   - Ensure network matches deployment network

### Debug Commands

```bash
# Check compilation
npx hardhat compile

# Check network connection
node -e "const { ethers } = require('ethers'); const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL'); provider.getNetwork().then(console.log)"

# Check wallet balance
node -e "const { ethers } = require('ethers'); const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL'); const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider); wallet.getBalance().then(b => console.log(ethers.formatEther(b) + ' ETH'))"
```

## 🔐 Security Notes

- **Never commit your `.env` file** to version control
- **Keep your private key secure** and never share it
- **Use test networks** for initial testing
- **Verify contract addresses** before running tests
- **Monitor gas costs** to avoid unexpected expenses

## 📈 Performance Monitoring

### Gas Optimization
- Monitor gas consumption across different input types
- Compare batch vs. individual operation costs
- Track storage operation overhead

### Network Performance
- Monitor transaction confirmation times
- Track network congestion impact
- Measure RPC endpoint reliability

## 🎯 Next Steps

After successful testing:

1. **Deploy to testnet** for broader testing
2. **Integrate with your dApp** for production use
3. **Monitor gas costs** in production environment
4. **Implement gas optimization** if needed
5. **Add more test scenarios** for edge cases

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure network connectivity and wallet balance
4. Review contract compilation and deployment logs

---

**Happy Testing! 🚀**

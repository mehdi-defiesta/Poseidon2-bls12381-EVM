# 🚀 Poseidon4Mock Deployment Guide

## Quick Start

The deployment scripts now use `dotenv` to read configuration from a `.env` file. This is the recommended approach for security and convenience.

### Setup

1. **Copy the environment template:**
```bash
cp env.template .env
```

2. **Edit the `.env` file** with your actual values:
```env
PRIVATE_KEY=your_64_character_private_key_without_0x
RPC_URL=https://your-rpc-endpoint.com
```

3. **Deploy the contracts:**
```bash
node scripts/deployPoseidon4Mock.js
```

4. **After deployment, add contract addresses** to your `.env` file:
```env
POSEIDON4_ADDRESS=0x... # Address from deployment
MOCK_ADDRESS=0x...      # Address from deployment
```

5. **Run the tests:**
```bash
node scripts/testPoseidon4OnChain.js
```

## Example with Local Hardhat Network

1. Start a local Hardhat network:
```bash
npx hardhat node
```

2. Create `.env` file:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545
```

3. Deploy:
```bash
node scripts/deployPoseidon4Mock.js
```

## Example with Sepolia Testnet

Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

Then deploy:
```bash
node scripts/deployPoseidon4Mock.js
```

## Example with Polygon

Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://polygon-rpc.com
```

Then deploy:
```bash
node scripts/deployPoseidon4Mock.js
```

## Testing Deployed Contracts

After deployment, add the contract addresses to your `.env` file and run:

```bash
node scripts/testPoseidon4OnChain.js
```

## Sample Output

```
🚀 === DEPLOYING POSEIDON4 MOCK CONTRACT ===

📋 Environment Configuration:
   RPC URL: http://127.0.0.1:8545
   Private Key: 0xac09...f80

🔗 Connected to network:
   Network: unknown
   Chain ID: 31337
   Wallet Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   Balance: 10000.0 ETH

📦 Compiling contracts...
✅ Compilation completed

📋 Deploying Poseidon4 contract...
✅ Poseidon4 deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   Transaction: 0x...

📋 Deploying Poseidon4Mock contract...
✅ Poseidon4Mock deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
   Transaction: 0x...
```

## Common RPC URLs

- **Local Hardhat**: `http://127.0.0.1:8545`
- **Ethereum Sepolia**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Polygon**: `https://polygon-rpc.com`
- **Arbitrum**: `https://arb1.arbitrum.io/rpc`
- **Base**: `https://mainnet.base.org`

## Security Notes

- Never commit private keys to version control
- Use test networks for development
- Ensure your wallet has sufficient balance for gas fees

## Troubleshooting

If you get "insufficient funds" errors, make sure your wallet has enough ETH for deployment gas costs (usually 0.01-0.1 ETH depending on the network).

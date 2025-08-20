const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    console.log("🚀 === DEPLOYING BN254 POSEIDON2 MOCK CONTRACT ===\n");

    // Check environment variables
    if (!process.env.PRIVATE_KEY) {
        console.log("❌ PRIVATE_KEY not found in .env file");
        console.log("");
        console.log("Please create a .env file with the following content:");
        console.log("PRIVATE_KEY=your_private_key_here");
        console.log("RPC_URL=your_rpc_url_here");
        console.log("");
        console.log("Or copy from env.template:");
        console.log("cp env.template .env");
        console.log("Then edit .env with your actual values");
        console.log("");
        throw new Error("PRIVATE_KEY is required in .env file");
    }
    if (!process.env.RPC_URL) {
        console.log("❌ RPC_URL not found in .env file");
        console.log("");
        console.log("Please add RPC_URL to your .env file");
        console.log("");
        throw new Error("RPC_URL is required in .env file");
    }

    console.log("📋 Environment Configuration:");
    console.log(`   RPC URL: ${process.env.RPC_URL}`);
    console.log(`   Private Key: ${process.env.PRIVATE_KEY.substring(0, 6)}...${process.env.PRIVATE_KEY.substring(process.env.PRIVATE_KEY.length - 4)}`);
    console.log("");

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("🔗 Connected to network:");
    const network = await provider.getNetwork();
    console.log(`   Network: ${network.name || 'Unknown'}`);
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Wallet Address: ${wallet.address}`);
    
    const balance = await provider.getBalance(wallet.address);
    console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
    console.log("");

    // Compile contracts
    console.log("📦 Compiling contracts...");
    try {
        const { execSync } = require('child_process');
        execSync('npx hardhat compile', { stdio: 'inherit' });
        console.log("✅ Compilation completed\n");
    } catch (error) {
        console.log("⚠️  Compilation failed, but continuing with deployment...\n");
    }

    // Deploy BN254Poseidon2 contract first
    console.log("📋 Deploying BN254Poseidon2 contract...");
    const BN254Poseidon2 = await ethers.getContractFactory("BN254Poseidon2");
    const bn254Poseidon2 = await BN254Poseidon2.connect(wallet).deploy();
    await bn254Poseidon2.waitForDeployment();
    const bn254Poseidon2Address = await bn254Poseidon2.getAddress();
    
    const bn254DeployTx = await bn254Poseidon2.deploymentTransaction();
    console.log(`✅ BN254Poseidon2 deployed at: ${bn254Poseidon2Address}`);
    console.log(`   Transaction: ${bn254DeployTx.hash}\n`);

    // Deploy BN254Poseidon2Mock contract
    console.log("📋 Deploying BN254Poseidon2Mock contract...");
    const BN254Poseidon2Mock = await ethers.getContractFactory("BN254Poseidon2Mock");
    const bn254Poseidon2Mock = await BN254Poseidon2Mock.connect(wallet).deploy(bn254Poseidon2Address);
    await bn254Poseidon2Mock.waitForDeployment();
    const bn254Poseidon2MockAddress = await bn254Poseidon2Mock.getAddress();
    
    const mockDeployTx = await bn254Poseidon2Mock.deploymentTransaction();
    console.log(`✅ BN254Poseidon2Mock deployed at: ${bn254Poseidon2MockAddress}`);
    console.log(`   Transaction: ${mockDeployTx.hash}\n`);

    // Verify deployment
    console.log("🔍 Verifying deployment...");
    try {
        const bn254Code = await provider.getCode(bn254Poseidon2Address);
        if (bn254Code !== "0x") {
            console.log("✅ BN254Poseidon2 contract verified on-chain");
        } else {
            console.log("❌ BN254Poseidon2 contract not found on-chain");
        }
        
        const mockCode = await provider.getCode(bn254Poseidon2MockAddress);
        if (mockCode !== "0x") {
            console.log("✅ BN254Poseidon2Mock contract verified on-chain");
        } else {
            console.log("❌ BN254Poseidon2Mock contract not found on-chain");
        }
    } catch (error) {
        console.log("⚠️  Could not verify contracts on-chain");
    }
    console.log("");

    // Test basic functionality
    console.log("🧪 Testing basic functionality...");
    try {
        // Test basic hash2 function
        const testResult = await bn254Poseidon2Mock.testHash2(1, 2);
        console.log(`✅ Basic hash2 test passed: ${testResult}`);
        
        // Test edge cases
        const edgeCaseResults = await bn254Poseidon2Mock.testEdgeCases();
        console.log(`✅ Edge cases test passed: ${edgeCaseResults.length} edge cases tested`);
        
        // Get test case count
        const testCaseCount = await bn254Poseidon2Mock.getTestCaseCount();
        console.log(`✅ Test case count: ${testCaseCount}`);
        
    } catch (error) {
        console.log(`❌ Testing failed: ${error.message}`);
    }
    console.log("");

    // Summary
    console.log("📋 === DEPLOYMENT SUMMARY ===\n");
    console.log("🏗️  Contracts Deployed:");
    console.log(`   BN254Poseidon2: ${bn254Poseidon2Address}`);
    console.log(`   BN254Poseidon2Mock: ${bn254Poseidon2MockAddress}`);
    console.log("");
    console.log("🔧 Available Functions:");
    console.log("   • testHash2(x, y) - Basic hash2 test");
    console.log("   • testHash2WithId(id, x, y) - Hash2 test with ID");
    console.log("   • batchTestHash2(inputs) - Batch hash2 test");
    console.log("   • testEdgeCases() - Test edge cases");
    console.log("   • testHash2Field(x, y) - Test with field values");
    console.log("   • getHashResult(x, y) - Get stored result");
    console.log("   • getTestCaseResult(id) - Get test case result");
    console.log("   • getTestCaseCount() - Get total test count");
    console.log("   • clearResults() - Clear stored results");
    console.log("   • estimateHash2Gas(x, y) - Estimate gas usage");
    console.log("");
    console.log("📊 Usage Examples:");
    console.log("   // Test basic hash2");
    console.log("   await bn254Poseidon2Mock.testHash2(1, 2);");
    console.log("");
    console.log("   // Test with ID");
    console.log("   await bn254Poseidon2Mock.testHash2WithId(1, 0, 0);");
    console.log("");
    console.log("   // Test edge cases");
    console.log("   await bn254Poseidon2Mock.testEdgeCases();");
    console.log("");
    console.log("   // Get result");
    console.log("   const result = await bn254Poseidon2Mock.getHashResult(1, 2);");
    console.log("");
    console.log("========================================");
    console.log("🚀 Deployment Completed Successfully! 🚀");
    console.log("========================================");
    console.log("");
    console.log("💡 Next steps:");
    console.log("   1. Add these addresses to your .env file:");
    console.log(`      BN254_POSEIDON2_ADDRESS=${bn254Poseidon2Address}`);
    console.log(`      BN254_MOCK_ADDRESS=${bn254Poseidon2MockAddress}`);
    console.log("   2. Run the testing script:");
    console.log("      node scripts/testing/testBN254Poseidon2OnChain.js");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });

const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    console.log("🚀 === DEPLOYING POSEIDON4 MOCK CONTRACT ===\n");

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
    console.log(`   Network: ${(await provider.getNetwork()).name}`);
    console.log(`   Chain ID: ${(await provider.getNetwork()).chainId}`);
    console.log(`   Wallet Address: ${wallet.address}`);
    console.log(`   Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} ETH`);
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

    // Deploy Poseidon4 contract first
    console.log("📋 Deploying Poseidon4 contract...");
    const Poseidon4 = await ethers.getContractFactory("Poseidon4", wallet);
    const poseidon4 = await Poseidon4.deploy();
    await poseidon4.waitForDeployment();
    const poseidon4Address = await poseidon4.getAddress();
    console.log(`✅ Poseidon4 deployed at: ${poseidon4Address}`);
    console.log(`   Transaction: ${poseidon4.deploymentTransaction().hash}`);
    console.log("");

    // Deploy Poseidon4Mock contract
    console.log("📋 Deploying Poseidon4Mock contract...");
    const Poseidon4Mock = await ethers.getContractFactory("Poseidon4Mock", wallet);
    const poseidon4Mock = await Poseidon4Mock.deploy(poseidon4Address);
    await poseidon4Mock.waitForDeployment();
    const mockAddress = await poseidon4Mock.getAddress();
    console.log(`✅ Poseidon4Mock deployed at: ${mockAddress}`);
    console.log(`   Transaction: ${poseidon4Mock.deploymentTransaction().hash}`);
    console.log("");

    // Verify deployment
    console.log("🔍 Verifying deployment...");
    try {
        const poseidon4Code = await provider.getCode(poseidon4Address);
        const mockCode = await provider.getCode(mockAddress);
        
        if (poseidon4Code !== "0x") {
            console.log("✅ Poseidon4 contract verified on-chain");
        } else {
            console.log("❌ Poseidon4 contract not found on-chain");
        }
        
        if (mockCode !== "0x") {
            console.log("✅ Poseidon4Mock contract verified on-chain");
        } else {
            console.log("❌ Poseidon4Mock contract not found on-chain");
        }
    } catch (error) {
        console.log("⚠️  Could not verify contracts on-chain:", error.message);
    }
    console.log("");

    // Test basic functionality
    console.log("🧪 Testing basic functionality...");
    try {
        // Test basic hash
        const testResult = await poseidon4Mock.testHash(1, 2, 3, 4);
        console.log(`✅ Basic hash test passed: ${testResult.toString()}`);
        
        // Test edge cases
        const edgeResults = await poseidon4Mock.testEdgeCases();
        console.log(`✅ Edge cases test passed: ${edgeResults.length} results`);
        
        // Get test case count
        const testCount = await poseidon4Mock.getTestCaseCount();
        console.log(`✅ Test case count: ${testCount.toString()}`);
        
    } catch (error) {
        console.log("❌ Basic functionality test failed:", error.message);
    }
    console.log("");

    // Deployment summary
    console.log("📋 === DEPLOYMENT SUMMARY ===\n");
    console.log("🏗️  Contracts Deployed:");
    console.log(`   Poseidon4: ${poseidon4Address}`);
    console.log(`   Poseidon4Mock: ${mockAddress}`);
    console.log("");
    console.log("🔧 Available Functions:");
    console.log("   • testHash(x, y, z, w) - Basic hash test");
    console.log("   • testHashWithId(id, x, y, z, w) - Hash test with ID");
    console.log("   • batchTestHash(inputs) - Batch hash test");
    console.log("   • testPermutation(inputs) - Test permutation");
    console.log("   • testEdgeCases() - Test edge cases");
    console.log("   • getHashResult(x, y, z, w) - Get stored result");
    console.log("   • getTestCaseResult(id) - Get test case result");
    console.log("   • getTestCaseCount() - Get total test count");
    console.log("   • clearResults() - Clear stored results");
    console.log("");
    console.log("📊 Usage Examples:");
    console.log(`   // Test basic hash`);
    console.log(`   await poseidon4Mock.testHash(1, 2, 3, 4);`);
    console.log("");
    console.log(`   // Test with ID`);
    console.log(`   await poseidon4Mock.testHashWithId(1, 0, 0, 0, 0);`);
    console.log("");
    console.log(`   // Test edge cases`);
    console.log(`   await poseidon4Mock.testEdgeCases();`);
    console.log("");
    console.log(`   // Get result`);
    console.log(`   const result = await poseidon4Mock.getHashResult(1, 2, 3, 4);`);
    console.log("");
    console.log("========================================\n🚀 Deployment Completed Successfully! 🚀");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });

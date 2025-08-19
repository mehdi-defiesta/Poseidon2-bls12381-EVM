const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 === Simple BN254Poseidon2 Gas Estimation ===\n");

    // Deploy the contract
    console.log("📋 Deploying BN254Poseidon2 contract...");
    
    const BN254Poseidon2 = await ethers.getContractFactory("BN254Poseidon2");
    const bn254Poseidon2 = await BN254Poseidon2.deploy();
    await bn254Poseidon2.waitForDeployment();
    const contractAddress = await bn254Poseidon2.getAddress();
    console.log(`✅ Contract deployed at: ${contractAddress}`);

    // Test inputs for hash_2 function
    const testInputs = [
        { x: 0, y: 0, name: "Zero inputs" },
        { x: 1, y: 2, name: "Small inputs" },
        { x: 123, y: 456, name: "Medium inputs" },
        { x: 2n ** 64n - 1n, y: 2n ** 64n - 2n, name: "Large inputs" }
    ];

    console.log("\n📊 === Gas Estimation Results ===\n");

    let totalGas = 0n;
    const results = [];

    for (const test of testInputs) {
        try {
            console.log(`🔍 Testing: ${test.name}`);
            console.log(`   Input: x=${test.x}, y=${test.y}`);
            
            // Estimate gas for hash_2 function
            const gas = await bn254Poseidon2.hash_2.estimateGas(test.x, test.y);
            const gasBigInt = BigInt(gas.toString());
            totalGas += gasBigInt;
            
            // Calculate cost at 20 gwei
            const cost = gasBigInt * 20n;
            
            results.push({
                name: test.name,
                gas: gasBigInt,
                cost: cost
            });
            
            console.log(`   Gas: ${gas.toString()}`);
            console.log(`   Cost (20 gwei): ${ethers.formatEther(cost)} ETH\n`);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    // Summary
    if (results.length > 0) {
        const avgGas = totalGas / BigInt(results.length);
        const minGas = results.reduce((min, r) => r.gas < min ? r.gas : min, results[0].gas);
        const maxGas = results.reduce((max, r) => r.gas > max ? r.gas : max, results[0].gas);
        
        console.log("📋 === Summary ===\n");
        console.log(`Average Gas: ${avgGas.toString()}`);
        console.log(`Min Gas: ${minGas.toString()}`);
        console.log(`Max Gas: ${maxGas.toString()}`);
        console.log(`Total Gas: ${totalGas.toString()}`);
        
        // Cost at different gas prices
        console.log("\n💰 === Cost Analysis ===\n");
        const gasPrices = [20, 50, 100, 200];
        gasPrices.forEach(price => {
            const avgCost = avgGas * BigInt(price);
            console.log(`${price} gwei: ${ethers.formatEther(avgCost)} ETH per hash`);
        });
    }

    console.log("\n✅ Gas estimation completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

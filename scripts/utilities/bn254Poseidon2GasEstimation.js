const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 === BN254Poseidon2 Gas Estimation Script ===\n");

    // Deploy the BN254Poseidon2 contract
    console.log("📋 Deploying BN254Poseidon2 contract...");
    
    const BN254Poseidon2 = await ethers.getContractFactory("BN254Poseidon2");
    const bn254Poseidon2 = await BN254Poseidon2.deploy();
    await bn254Poseidon2.waitForDeployment();
    const contractAddress = await bn254Poseidon2.getAddress();
    console.log(`✅ BN254Poseidon2 deployed at: ${contractAddress}`);

    // Test data sets for comprehensive gas estimation
    const testCases = [
        { name: "Zero inputs", inputs: [0, 0] },
        { name: "Small inputs", inputs: [1, 2] },
        { name: "Medium inputs", inputs: [123, 456] },
        { name: "Large inputs", inputs: [2n ** 64n - 1n, 2n ** 64n - 2n] },
        { name: "Near field size", inputs: [2n ** 128n - 1n, 2n ** 128n - 2n] },
        { name: "Random-like", inputs: [0x1234567890abcdefn, 0xfedcba0987654321n] },
        { name: "Field edge case 1", inputs: [0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000n, 1n] },
        { name: "Field edge case 2", inputs: [1n, 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000n] }
    ];

    console.log("\n📊 === Gas Consumption Analysis ===\n");

    const results = [];
    let totalGas = 0n;

    for (const testCase of testCases) {
        console.log(`🔍 Testing: ${testCase.name} [${testCase.inputs.join(', ')}]`);
        
        try {
            // Convert inputs to Field.Type (uint256)
            const x = testCase.inputs[0];
            const y = testCase.inputs[1];
            
            // Estimate gas for hash_2 function
            const gas = await bn254Poseidon2.hash_2.estimateGas(x, y);
            const gasBigInt = BigInt(gas.toString());
            totalGas += gasBigInt;
            
            // Calculate cost at different gas prices
            const cost20Gwei = gasBigInt * 20n; // 20 gwei
            const cost50Gwei = gasBigInt * 50n; // 50 gwei
            const cost100Gwei = gasBigInt * 100n; // 100 gwei
            
            results.push({
                name: testCase.name,
                inputs: testCase.inputs,
                gas: gasBigInt,
                cost20Gwei: cost20Gwei,
                cost50Gwei: cost50Gwei,
                cost100Gwei: cost100Gwei
            });
            
            console.log(`   Gas: ${gas.toString()}`);
            console.log(`   Cost (20 gwei): ${ethers.formatEther(cost20Gwei)} ETH`);
            console.log(`   Cost (50 gwei): ${ethers.formatEther(cost50Gwei)} ETH`);
            console.log(`   Cost (100 gwei): ${ethers.formatEther(cost100Gwei)} ETH\n`);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    // Calculate statistics
    const avgGas = totalGas / BigInt(results.length);
    const gasValues = results.map(r => r.gas);
    const minGas = gasValues.reduce((min, gas) => gas < min ? gas : min);
    const maxGas = gasValues.reduce((max, gas) => gas > max ? gas : max);
    const variance = maxGas - minGas;

    console.log("📋 === Gas Consumption Statistics ===\n");
    console.log(`🏆 Total Gas Used: ${totalGas.toString()}`);
    console.log(`📊 Average Gas: ${avgGas.toString()}`);
    console.log(`📈 Min Gas: ${minGas.toString()}`);
    console.log(`📉 Max Gas: ${maxGas.toString()}`);
    console.log(`📊 Variance: ${variance.toString()}`);

    // Cost analysis at different gas prices
    console.log("\n💰 === Cost Analysis ===\n");
    
    const gasPrices = [20, 50, 100, 200, 500]; // gwei
    gasPrices.forEach(price => {
        const totalCost = totalGas * BigInt(price);
        const avgCost = avgGas * BigInt(price);
        console.log(`Gas Price: ${price} gwei`);
        console.log(`   Total Cost: ${ethers.formatEther(totalCost)} ETH`);
        console.log(`   Average Cost: ${ethers.formatEther(avgCost)} ETH`);
        console.log(`   Cost per hash: ${ethers.formatEther(avgCost)} ETH\n`);
    });

    // Performance ranking
    console.log("🏆 === Performance Ranking ===\n");
    results.sort((a, b) => Number(a.gas - b.gas));
    
    results.forEach((result, index) => {
        const rank = index + 1;
        const emoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🏅";
        console.log(`${emoji} ${rank}. ${result.name}: ${result.gas.toString()} gas`);
    });

    // Verify function correctness
    console.log("\n🔍 === Function Correctness Verification ===\n");
    
    try {
        const testInputs = [1, 2];
        const output = await bn254Poseidon2.hash_2(testInputs[0], testInputs[1]);
        
        console.log("✅ Function executed successfully!");
        console.log(`   Input: [${testInputs.join(', ')}]`);
        console.log(`   Output: ${output.toString()}`);
        console.log(`   Output type: ${typeof output}`);
        
        // Check if output is within field range
        const fieldPrime = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
        if (output < fieldPrime) {
            console.log("✅ Output is within valid field range");
        } else {
            console.log("❌ Output exceeds field range");
        }
        
    } catch (error) {
        console.log(`❌ Error during correctness verification: ${error.message}`);
    }

    // Gas efficiency analysis
    console.log("\n💡 === Gas Efficiency Analysis ===\n");
    
    const baseGas = minGas; // Assuming minimum gas is the base cost
    const inputOverhead = maxGas - minGas;
    
    console.log(`Base hash cost: ${baseGas.toString()} gas`);
    console.log(`Input processing overhead: ${inputOverhead.toString()} gas`);
    console.log(`Efficiency ratio: ${(Number(maxGas) / Number(minGas)).toFixed(3)}x`);
    
    if (inputOverhead > 0) {
        console.log(`Input overhead percentage: ${((Number(inputOverhead) / Number(maxGas)) * 100).toFixed(2)}%`);
    }

    // Recommendations
    console.log("\n💡 === Recommendations ===\n");
    
    if (avgGas > 500000) {
        console.log("⚠️  High gas consumption detected (>500K gas)");
        console.log("   Consider implementing gas optimizations:");
        console.log("   • S-box optimization (x^5 calculation)");
        console.log("   • Matrix multiplication unrolling");
        console.log("   • Assembly-level optimizations");
    } else if (avgGas > 200000) {
        console.log("📊 Moderate gas consumption (200K-500K gas)");
        console.log("   Performance is acceptable for most use cases");
        console.log("   Consider optimizations for high-frequency usage");
    } else {
        console.log("✅ Excellent gas efficiency (<200K gas)");
        console.log("   Performance is optimal for production use");
    }

    console.log("\n========================================\n🚀 Gas Estimation Completed! 🚀");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

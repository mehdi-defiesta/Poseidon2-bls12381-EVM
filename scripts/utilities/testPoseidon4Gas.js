const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 === POSEIDON4 GAS CONSUMPTION TEST ===\n");

    // Deploy the contract
    console.log("📋 Deploying Poseidon4 contract...");
    const Poseidon4 = await ethers.getContractFactory("Poseidon4");
    const poseidon4 = await Poseidon4.deploy();
    await poseidon4.waitForDeployment();
    const contractAddress = await poseidon4.getAddress();
    console.log(`✅ Contract deployed at: ${contractAddress}\n`);

    // Test different input types and estimate gas
    console.log("📊 Estimating Gas Consumption...\n");

    // Test 1: Zero inputs
    console.log("🔍 Test 1: Zero inputs [0, 0, 0, 0]");
    const gas1 = await poseidon4.poseidon4Uint256.estimateGas(0, 0, 0, 0);
    console.log(`   Estimated gas: ${gas1.toString()}\n`);

    // Test 2: Small inputs
    console.log("🔍 Test 2: Small inputs [1, 2, 3, 4]");
    const gas2 = await poseidon4.poseidon4Uint256.estimateGas(1, 2, 3, 4);
    console.log(`   Estimated gas: ${gas2.toString()}\n`);

    // Test 3: Medium inputs
    console.log("🔍 Test 3: Medium inputs [123, 456, 789, 101112]");
    const gas3 = await poseidon4.poseidon4Uint256.estimateGas(123, 456, 789, 101112);
    console.log(`   Estimated gas: ${gas3.toString()}\n`);

    // Test 4: Large inputs (near field size)
    console.log("🔍 Test 4: Large inputs [2^64-1, 2^64-2, 2^64-3, 2^64-4]");
    const largeInput1 = 2n ** 64n - 1n;
    const largeInput2 = 2n ** 64n - 2n;
    const largeInput3 = 2n ** 64n - 3n;
    const largeInput4 = 2n ** 64n - 4n;
    const gas4 = await poseidon4.poseidon4Uint256.estimateGas(largeInput1, largeInput2, largeInput3, largeInput4);
    console.log(`   Estimated gas: ${gas4.toString()}\n`);

    // Test 5: Permutation function (5 inputs)
    console.log("🔍 Test 5: Permutation function (5 inputs)");
    const permInputs = [
        ethers.parseUnits("1", 0),
        ethers.parseUnits("2", 0),
        ethers.parseUnits("3", 0),
        ethers.parseUnits("4", 0),
        ethers.parseUnits("5", 0)
    ];
    const gas5 = await poseidon4.permutation.estimateGas(permInputs);
    console.log(`   Estimated gas: ${gas5.toString()}\n`);

    // Test 6: Test vector functions
    console.log("🔍 Test 6: Test vector functions");
    const gas6a = await poseidon4.testVector1.estimateGas();
    console.log(`   testVector1() - Estimated gas: ${gas6a.toString()}`);
    
    const gas6b = await poseidon4.testVector2.estimateGas();
    console.log(`   testVector2() - Estimated gas: ${gas6b.toString()}`);
    
    const gas6c = await poseidon4.testVector3.estimateGas();
    console.log(`   testVector3() - Estimated gas: ${gas6c.toString()}\n`);

    // Summary
    console.log("📋 === GAS CONSUMPTION SUMMARY ===\n");
    
    const gasUsage = [
        { name: "Zero inputs [0,0,0,0]", gas: gas1.toString() },
        { name: "Small inputs [1,2,3,4]", gas: gas2.toString() },
        { name: "Medium inputs [123,456,789,101112]", gas: gas3.toString() },
        { name: "Large inputs [2^64-1,2^64-2,2^64-3,2^64-4]", gas: gas4.toString() },
        { name: "Permutation (5 inputs)", gas: gas5.toString() },
        { name: "testVector1()", gas: gas6a.toString() },
        { name: "testVector2()", gas: gas6b.toString() },
        { name: "testVector3()", gas: gas6c.toString() }
    ];

    // Sort by gas usage
    gasUsage.sort((a, b) => parseInt(a.gas) - parseInt(b.gas));
    
    console.log("🏆 Gas Usage Ranking (Lowest to Highest):");
    gasUsage.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}: ${item.gas} gas`);
    });

    console.log(`\n💰 Cost Analysis (at 20 gwei gas price):`);
    const avgGas = gasUsage.reduce((sum, item) => sum + parseInt(item.gas), 0) / gasUsage.length;
    console.log(`   Average gas usage: ${Math.round(avgGas)} gas`);
    
    // Calculate cost at 20 gwei
    const gasPrice20Gwei = ethers.parseUnits("20", "gwei");
    const avgCost = (BigInt(Math.round(avgGas)) * gasPrice20Gwei);
    console.log(`   Average cost: ${ethers.formatEther(avgCost)} ETH (at 20 gwei)`);
    
    const minGas = parseInt(gasUsage[0].gas);
    const maxGas = parseInt(gasUsage[gasUsage.length - 1].gas);
    console.log(`   Range: ${minGas} - ${maxGas} gas`);
    console.log(`   Variance: ${maxGas - minGas} gas`);

    // Performance analysis
    console.log(`\n⚡ Performance Analysis:`);
    console.log(`   Most efficient: ${gasUsage[0].name} (${gasUsage[0].gas} gas)`);
    console.log(`   Least efficient: ${gasUsage[gasUsage.length - 1].name} (${gasUsage[gasUsage.length - 1].gas} gas)`);
    console.log(`   Efficiency ratio: ${(maxGas / minGas).toFixed(2)}x`);

    console.log("\n========================================\n🚀 GAS CONSUMPTION TEST COMPLETED! 🚀");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

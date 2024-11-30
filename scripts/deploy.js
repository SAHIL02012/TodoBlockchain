
const { ethers } = require("hardhat");


const main = async () => {
    try{
    const contractFactory = await ethers.getContractFactory('TaskContract');
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    console.log("Contract deployed to: ", contract.target);
    }
    catch(error)
    {
        console.log("Error in main:",error);
    }
}
 
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
 
runMain();
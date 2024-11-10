async function main() {
    const [deployer] = await ethers.getSigners();
    const EcoBadgeNFT = await ethers.getContractFactory("EcoBadgeNFT");
    const ecoBadgeNFT = await EcoBadgeNFT.deploy(deployer.address); // Pass initial owner
    await ecoBadgeNFT.deployed();
    console.log("EcoBadgeNFT deployed to:", ecoBadgeNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

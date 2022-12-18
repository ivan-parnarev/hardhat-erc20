const { network } = require("hardhat")
const { developmentChains, INITIAL_SUPPLY } = require("../helper-hardhat.config")
const { verify } = require("../utils/verify-manual-token")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const testToken = await deploy("ManualTestToken", {
        from: deployer,
        args: [INITIAL_SUPPLY, "TestToken", "TT"],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`TestToken deployed at ${testToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(testToken.address, [INITIAL_SUPPLY, "TestToken", "TT"])
    }
}

module.exports.tags = ["all", "token"]

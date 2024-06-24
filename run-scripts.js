const ngrok = require("ngrok")
const fs = require("fs")
const spawn = require("child_process").spawn
require("dotenv").config()

const startServerScript = "node server.js"

// const startServer = spawn(startServerScript, { cwd: process.env.DIRECTORY, shell: true })
// startServer.stdout.setEncoding("utf8")
// startServer.stdout.on("data", data => {
  // if (data.includes("8080")) {
    console.log(process.env.TOKEN1)
    const startTunnel = async () => {
      // const url = await ngrok.connect({
      //   addr: 8080,
      //   authtoken: process.env.TOKEN1
      // })
      const url = await ngrok.connect(8080)
  
      console.log(url)
    }

    // setTimeout(() => {
      startTunnel()
    // }, 10000)
  // }
// })
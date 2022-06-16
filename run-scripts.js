const ngrok = require("ngrok")
const fs = require("fs")
const spawn = require("child_process").spawn
require("dotenv").config()

const startServerScript = "node server.js"

const startServer = spawn(startServerScript, { cwd: process.env.DIRECTORY, shell: true })
startServer.stdout.setEncoding("utf8")
startServer.stdout.on("data", data => {
  console.log("data")
})
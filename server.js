const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
  const path = req.url
  const menuPath = "E:\\TV"

  if (path == "/menu") {
    const menu = { videos: [] }
    readFolder(menuPath, menu)
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" })
    res.write(JSON.stringify({ menu: menu }))
    res.end()
  }

  if (path.startsWith("/video")) {
    const video = decodeURI(path).split("/video?path=")[1]
    const videoPath = menuPath + "\\" +  video
    const fileExists = fs.existsSync(videoPath)

    if (fileExists) {
      const stat = fs.statSync(videoPath)
      const fileSize = stat.size
      const range = req.headers.range

      const isMp4 = video.includes(".mp4")
      const isAvi = video.includes(".avi")
      const contentType = isMp4 ? "video/mp4" : isAvi ? "video/x-msvideo" : "video/webm"
      
  
      if (range) {
        console.log(range)
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
        const chunksize = (end - start) + 1
        
        const file = fs.createReadStream(videoPath, {start, end})
        console.log(contentType)
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
          "Access-Control-Allow-Origin": "*"
        }
        
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': contentType,
          "Access-Control-Allow-Origin": "*"
        }
  
        res.writeHead(200, head)
        fs.createReadStream(videoPath).pipe(res)
      }
    } else {
      res.statusCode = 404
      res.end()
    }
  }

})

server.listen(8080, () => {
  console.log('Example app listening on port 8080!')
});



const readFolder = (path, obj) => {
  const isDirectory = fs.statSync(path).isDirectory()
  if (isDirectory) {
    fs.readdirSync(path).forEach(file => {
      const isFolder = fs.statSync(path + "\\" + file).isDirectory()
      const isVideo = file.endsWith(".mp4") || file.endsWith(".mkv") || file.endsWith(".avi")
      if (!isFolder && isVideo) obj["videos"].push(file)
      else if (isFolder) {
        const newObj = { videos: [] }
        obj[file] = readFolder(path + "\\" + file, newObj)
      }
    })
  }
  return obj
}
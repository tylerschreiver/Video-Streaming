const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
  const path = req.url
  const menuPath = "Z:\\Videos"
  const tvPath = "Z:\\Videos\\TV"
  const moviePath = "Z:\\Videos\\Movies"

  if (path === "/menu") {
    const menu = { videos: [] }
    const menu2 = { videos: [] }
    readFolder(tvPath, menu)
    readFolder(moviePath, menu2)
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" })
    res.write(JSON.stringify({ menu: { TV: menu, Movies: menu2 } }))
    res.end()
  }

  if (path.startsWith("/video")) {
    console.log('fetch video')
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
  console.log('Video streaming backend listening on port 8080!')
});

const readFolder = (path, obj) => {
  const isDirectory = fs.statSync(path).isDirectory()
  if (isDirectory) {
    fs.readdirSync(path).forEach(file => {
      const isFolder = fs.statSync(path + "\\" + file).isDirectory()
      const isVideo = file.endsWith(".mp4") || file.endsWith(".mkv")

      if (!isFolder && isVideo) { // video found
        obj["videos"].push(file)
      } else if (isFolder) { // folder found
        const newObj = { videos: [] }
        obj[file] = readFolder(path + "\\" + file, newObj) // recursively search through folder's subfolders

        // removes folders that do not have any videos and do not have subfolders
        if (obj[file].videos.length === 0 && Object.keys(obj[file]).length === 1) {
          delete obj[file]
        }
      }
    })
  }

  return obj
}
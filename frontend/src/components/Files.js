import { ReactComponent as Folder } from '../assets/folder-solid.svg'
import { ReactComponent as Video } from '../assets/circle-play-solid.svg'
import './Files.css'

const Files = ({ menu, fetchVideo, path, setPath }) => {

  let currentDir = menu
  path.forEach(file => {
    currentDir = currentDir[file]
  })

  // prevent error if path is broken (eg: folder name changes)
  if (currentDir === undefined || currentDir === null) {
    setPath([])
  }
  
  let folders = Object.keys(currentDir)
  let videos = currentDir.videos

  const addToPath = file => {
    let newPath = [...path]
    newPath.push(file)
    setPath(newPath)
  }

  const goBack = () => {
    let newPath = [...path]
    newPath.splice(newPath.length - 1, 1)
    setPath(newPath)
  }
  
  const renderFolder = file => {
    if (file === "videos") return null
    return (
      <div className="file" key={file} onClick={() => addToPath(file)}>
        <Folder className="file-icon"/>
        <span className="file-text">{file}</span>
      </div>
    )
  }

  const getVideo = file => {
    let url = ""
    path.forEach(folder => {
      url += folder
      url += "\\"
    })

    url += file
    // fetchVideo(url)
    fetchVideo(encodeURI(url))
  }

  const renderVideo = file => {
    return (
      <div className="file" key={file} onClick={() => getVideo(file)}>
        <Video className="file-icon"/>
        <span className="file-text">{file}</span>
      </div>
    )
  }

  const renderGoBack = () => {
    if (path.length === 0) return null
    else return (
      <div className="file" onClick={() => goBack()}>
        <span className="file-text">..</span>
      </div>
    )
  }

  return (
    <div className="files-wrapper">
      {renderGoBack()}
      {folders.map((file) => renderFolder(file))}
      {videos && videos.length && videos.map((file) => renderVideo(file))}
    </div>
  )
}

export default Files
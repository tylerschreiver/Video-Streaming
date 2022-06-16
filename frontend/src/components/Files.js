import { useState } from 'react'
import { ReactComponent as Folder } from '../assets/folder-solid.svg'
import { ReactComponent as Video } from '../assets/circle-play-solid.svg'
import './Files.css'

const Files = ({ menu, fetchVideo, path, setPath }) => {

  let currentDir = menu
  path.forEach(file => {
    currentDir = currentDir[file]
  })
  
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
    if (file == "videos") return null
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
    fetchVideo(url)
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
    if (path.length == 0) return null
    else return (
      <div className="file" onClick={() => goBack()}>
        <span className="file-text">..</span>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: "10px" }}>
      {renderGoBack()}
      {folders.map((file) => renderFolder(file))}
      {videos.map((file) => renderVideo(file))}
    </div>
  )
}

export default Files
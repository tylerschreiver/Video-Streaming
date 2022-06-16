import React, { useState, useEffect } from 'react'
import Loader from './components/Loader'
import Files from './components/Files'
import './App.css'

const api = "https://55d8-162-154-226-2.ngrok.io"

const App = () => {
  const [menu, setMenu] = useState(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [path, setPath] = useState([])

  const isLoaded = menu != null
  const showVideo = videoUrl != ""

  useEffect(() => {
    fetchMenu()
    checkLocalStorage()
  }, [])

  const fetchMenu = async () => {
    const url = `${api}/menu`
    const response = await fetch(url)
    const json = await response.json()
    setMenu(json)
  }

  const checkLocalStorage = () => {
    const savedPath = localStorage.getItem("path")
    if (savedPath != null) {
      setPath(JSON.parse(savedPath))
    }

    const currentVideo = localStorage.getItem("video")
    if (currentVideo != null) {
      setVideoUrl(currentVideo)
    }
  }

  const fetchVideo = (path) => {
    const url = `${api}/video?path=${path}` 
    const fetchData = async () => {
      const response = await fetch(url)
      localStorage.setItem("video", response.url)
      setVideoUrl(response.url)
    }

    fetchData()
  }

  const savePath = path => {
    localStorage.setItem("path", JSON.stringify(path))
    setPath(path)
  }

  const exitVideo = () => {
    setVideoUrl("")
    localStorage.removeItem("video")
  }

  if (!isLoaded) {
    return (
      <div className="loader-wrapper">
        <Loader />    
      </div>
    );
  } else if (showVideo) {
    return (
      <div className="video-wrapper">
        <div className="video-holder">
        <div className="go-back-wrapper">
          <span className="go-back" onClick={() => exitVideo()}>
            Go Back
          </span>
        </div>
          <video className="video" type="video/webm" controls autoPlay src={videoUrl}>
            {/* <source src={videoUrl} /> */}
          </video>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <Files
          menu={menu.menu} 
          fetchVideo={(path) => fetchVideo(path)}
          path={path}
          setPath={path => savePath(path)}
        />
      </div>
    )
  }
}

export default App;

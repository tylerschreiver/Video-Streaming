import React, { useState, useEffect } from 'react'
import Loader from './components/Loader'
import Files from './components/Files'
import Video from './components/Video'
import Header from './components/Header';
import Env from './assets/env.json'
import './App.css'

const App = () => {
  const [menu, setMenu] = useState(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [path, setPath] = useState([])

  const isLoaded = menu !== null
  const showVideo = videoUrl !== ""

  useEffect(() => {
    fetchMenu()
    checkLocalStorage()
  }, [])

  const fetchMenu = async () => {
    const url = `${Env.api_url}/menu`
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
    const url = `${Env.api_url}/video?path=${path}`
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

  const headerClick = () => {
    exitVideo()
    setPath([])
  }

  if (!isLoaded) {
    return (
      <div className="loader-wrapper">
        <Loader />
      </div>
    );
  } else if (showVideo) {
    return <div className="body-wrapper">
      <Header headerClick={headerClick} />
      <Video exitVideo={exitVideo} videoUrl={videoUrl} />
    </div>
  } else {
    return (
      <div className="body-wrapper">
      <Header headerClick={headerClick} />
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

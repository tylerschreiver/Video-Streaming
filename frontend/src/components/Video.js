import './Video.css'

const Video = ({ videoUrl, exitVideo }) => {
    return <div className="video-wrapper">
    <div className="video-holder">
        <video
            className="video"
            type="video/webm"
            controls
            autoPlay
            onError={e => {
                console.log(e)
                exitVideo()
            }}
            src={videoUrl}
        />
    </div>
  </div>
}

export default Video
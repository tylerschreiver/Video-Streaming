import './Header.css'

const Header = ({ headerClick }) => {
    return <div className="header-wrapper" onClick={headerClick}>
        <h1 className="header">Video Streaming</h1>
    </div>
}

export default Header
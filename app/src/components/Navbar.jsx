import { Link } from 'react-router-dom'

import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
        <h2>
            <Link to={`/`}><img src='./icon.svg' height={50} /></Link>
        </h2>
        <ul>
            <li>
                <Link to={`/`}>home</Link>
            </li>
            <li>
                <Link to={`/job`} className="job">job</Link>
            </li>
            <li>
                <Link to={`/dag`} className="dag">dag</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar
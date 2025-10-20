import React from 'react'
import { Link } from 'react-router-dom';
import '../styling/Navbar.css';
export default function NavBar() {
  return (
    <>
      <div className='navbar'>
        <div >
          <Link to='/'><img src="/assets/logo.png" className='logoPic'></img></Link>
        </div>
      <div>
        <Link to="/" className = "pagesLink">Home</Link>
        <Link to="/medical" className = "pagesLink" >Medical</Link>
        <Link to="/life" className = "pagesLink">Life</Link>
        <Link to="/car" className = "pagesLink">Car</Link>
      </div>
      <Link to="/profile">
        <img src="/assets/profile.png" className="profilePic"/>
      </Link>
      </div>
    </>
  )
}

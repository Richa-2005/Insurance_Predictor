import React from 'react'
import { Link } from 'react-router-dom';
import '../styling/Navbar.css';
import { useAuth } from '../src/authentication/reactfiles/Auth.jsx';

export default function NavBar() {
  const { currentUser } = useAuth(); 
  
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
      
        {/* 3. Conditional auth links */}
        <div className="navbar-auth">
          {currentUser && !currentUser.isAnonymous ? (
            // User is logged in with Email/Pass
            <Link to="/profile">
              <img src="/assets/profile.png" className="profilePic" alt="Profile"/>
            </Link>
          ) : (
            // User is not logged in or is anonymous
            <>
              <Link to="/login" className="pagesLink auth-link-btn">Log In</Link>
              <Link to="/signup" className="pagesLink auth-link-btn primary">Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </>
  )
}

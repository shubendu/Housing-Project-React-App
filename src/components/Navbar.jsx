import React from 'react'
import {RiFindReplaceLine} from 'react-icons/ri'
import { useNavigate,useLocation } from 'react-router-dom'
import {  MdLocalOffer } from 'react-icons/md'
import {CgProfile} from 'react-icons/cg'

const Navbar = () => {
    const navigate=useNavigate()
    const location=useLocation()
    const pathMatchRoute=(route)=>{
        if(route===location.pathname){
            return true
        }

    }
  return (
   <footer className='navbar'>
    <nav className='navbarNav'>
        <ul className='navbarListItems'>
            <li className='navbarListItem' onClick={()=>navigate('/')} >
            <RiFindReplaceLine fill={pathMatchRoute('/')?'#2c2c2c':'#8f8f8f'} width='40px'/>
            <p className={pathMatchRoute('/')?'navbarListItemnaveActive':'navbarListItemName'}>Explore</p>
            </li>

            <li className='navbarListItem' onClick={()=>navigate('/offer')}>
            <MdLocalOffer  fill={pathMatchRoute('/offer')?'#2c2c2c':'#8f8f8f'} width='40px'/>
            <p className={pathMatchRoute('/offer')?'navbarListItemnaveActive':'navbarListItemName'}>Offer</p>
            </li>
            <li className='navbarListItem' onClick={()=>navigate('/profile')}>
            <CgProfile fill={pathMatchRoute('/profile')?'#2c2c2c':'#8f8f8f'} width='40px'/>
            <p className={pathMatchRoute('/profile')?'navbarListItemnaveActive':'navbarListItemName'}>Profile</p>
            </li>
        </ul>
    </nav>
   </footer>
  )
}

export default Navbar
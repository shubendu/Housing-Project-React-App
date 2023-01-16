import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useState } from 'react'
import {AiOutlineArrowRight } from 'react-icons/ai'
import OAuth from '../components/OAuth'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



const Signin = () => {
 const [showPassword,setShowPassword]=useState(false)
 const [formData,setFormData]=useState({
    email:'',
    password:''
 })

 const { email,password }=formData
 const navigate=useNavigate()
 const onChange=(e)=>{
    setFormData((prevState)=>({
        ...prevState,
        [e.target.id]:e.target.value
    }))


 }

 const onSubmit= async(e)=>{
    e.preventDefault()
    const auth = getAuth();
 await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    if(userCredential.user){
        navigate('/')
    }
  })
 
  .catch((error) => {
    console.log(error)
  });



 }


  return (
    <div className='pageContainer'>
        <header>
            <p className="pageHeader">Welcom Back!</p>
        </header>
        <form onSubmit={onSubmit}>
            <input 
            type="email"
            placeholder='Email'
            className='emailInput'
            id='email'
            value={email}
            onChange={onChange}
            />
            <div className='passwordInputDiv'>
           
           
                
                <input 
                type={showPassword?'text':'password'}
                className='passwordInput'
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange} 
               
                
                 /> 
                 <img 
                 src={visibilityIcon}
                 alt='show password'
                 className='showPassword' 
                 onClick={()=>setShowPassword((prevState)=>!prevState)}
                  />
                 

            </div>
            <Link to='/forget-password'  className='forgetPasswordLink'>ForgetPassword</Link>
            <div className='signInBar'>
                <p className='dignInText'>Sign-In</p>
                <button className='signInButton'>
                    <AiOutlineArrowRight fill='#ffffff' width='34px' height='34px' />
                </button>
            </div>
        </form>
        {/*<OAuth/>*/}
        <OAuth/>
        <Link to='/sign-up' className='registerLink'>SignUp Instead</Link>
    </div>
  )
}

export default Signin
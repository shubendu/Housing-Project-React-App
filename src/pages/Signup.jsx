import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useState } from 'react'
import {AiOutlineArrowRight } from 'react-icons/ai'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { db } from '../firebase.config'
import { doc, serverTimestamp, setDoc } from "firebase/firestore"; 
import OAuth from '../components/OAuth'


const Signup = () => {
 const [showPassword,setShowPassword]=useState(false)
 const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:''
 })

 const { name,email,password }=formData
 const navigate=useNavigate()
 const onChange=(e)=>{
    setFormData((prevState)=>({
        ...prevState,
        [e.target.id]:e.target.value
    }))


 }

 const onSubmit=async(e)=>{
    e.preventDefault()

    try {
        const auth =  getAuth();
        const userCredential= await createUserWithEmailAndPassword(auth, email, password)

        const user = userCredential.user;
        updateProfile(auth.currentUser, {
            displayName: name
          })
          navigate('/')
        console.log(user)
    
    // ...set deta to firestore database
    const formDataCopy={...formData}
    formDataCopy.timestamp=serverTimestamp()
    await setDoc(doc(db,"users",user.uid),formDataCopy)

  
        
    } catch (error) {
        console.log(error)
        
    }
    
 


 }


  return (
    <div className='pageContainer'>
        <header>
            <p className="pageHeader">Welcom Back!</p>
        </header>
        <form onSubmit={onSubmit}>
        <input 
            type="name"
            placeholder='Name'
            className='nameInput'
            id='name'
            value={name}
            onChange={onChange}
            />
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
            <div className='signUpBar'>
                <p className='dignInText'>Sign-Up</p>
                <button className='signUpButton'>
                    <AiOutlineArrowRight fill='#ffffff' width='34px' height='34px' />
                </button>
            </div>
        </form>
      
       {/*<OAuth/>*/}
        <Link to='/sign-in' className='registerLink'>Signin Instead</Link>

        <OAuth/>
    </div>
  )
}

export default Signup
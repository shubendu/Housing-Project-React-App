import React from 'react'
import { useState,useEffect } from 'react'
import { updateProfile  } from 'firebase/auth'
import { getAuth } from "firebase/auth";
import { useNavigate ,Link} from 'react-router-dom'
import { doc, updateDoc,collection,getDocs,query,where,orderBy,deleteDoc, connectFirestoreEmulator } from "firebase/firestore";
import { db } from '../firebase.config';
import { FaHome } from 'react-icons/fa'
import { BsArrowReturnRight } from 'react-icons/bs'
import  ListingItem from '../components/ListingItem'
import { async } from '@firebase/util';
import { toast } from 'react-toastify';


const Profile = () => {

    const auth=getAuth()
    const navigate=useNavigate()

    const [listings,setListings]=useState(null)
    const [loading,setLoading]=useState(true)
    const [user,setUser]=useState(null)
    const [formData,setFormData]=useState({
        name:auth.currentUser.displayName,
        email:auth.currentUser.email
    })
    const [changeDetails,setChangeDetails]=useState(false)
    const { name,email }=formData


   
  

    useEffect(()=>{
       setUser(auth.currentUser)
        console.log(auth.currentUser)
    },[])


 ///fetchting listing item
 useEffect(() => {
  const fetchUserListings = async () => {
    const listingsRef = collection(db, 'listings')

    const q = query(
      listingsRef,
      where('useRef', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    )

    const querySnap = await getDocs(q)

    let listings = []

    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    setListings(listings)
    setLoading(false)
  }

  fetchUserListings()
}, [auth.currentUser.uid])


 

//
    
    const onSubmit=async(e)=>{
       
        try {
            if(auth.currentUser.displayName !== name){
                await updateProfile(auth.currentUser, {
                    displayName:name
                  })
            }
            //update in firestore database
            const userRef=doc(db,'users',auth.currentUser.uid)
            await updateDoc(userRef,{name})

            
        } catch (error) {
            console.log('could not update user')
            
        }


    }
    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]:e.target.value
        }))

    }
    const onLogout = () => {
        auth.signOut()
        navigate('/')
      }
     
    const onEdit=(listingId)=>{
      navigate(`/edit-listing/${listingId}`)
    }

      const onDelete=async(listingId)=>{
        if(window.confirm('are you  sure you want to delete?'))
        { await deleteDoc(doc(db,'listings',listingId))
         const updateListings=listings.filter((listing)=>
         listing.id !== listingId)
         setListings(updateListings)
         toast.success('successfully deleted Listing')
        
      }
      }


  return (<>
   
   <div className='profile'>
    <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button className='logOut' type='button' onClick={onLogout}>LogOut</button>
        {name}
        {email}
    </header>
    <main>
        <div className="profileDetailsHeader">
            <p className='profileDetailsText'>Personal Details</p>
            <p className='changePersonalDetails'
            onClick={()=>{changeDetails && onSubmit() 
            setChangeDetails((prevState)=>(!prevState))
            }}
            >{changeDetails?'done':'change'}</p>
        </div>
        <div className='profileCard'>
            <form >
                <input type="text"
                id='name'
                value={name}
                className={!changeDetails?'profileName':'profileNameActive'}
                onChange={onChange}
                disabled={!changeDetails}
                />
                 <input type="text"
                id='email'
                value={email}
                className={!changeDetails?'profileEmail':'profileEmailActive'}
                onChange={onChange}
                disabled={!changeDetails}
                />
            </form>
        </div>
        <Link to='/create-listing' className='createListing'>
            <FaHome/>
            <p>Sell or Rent Your Property</p>
            <BsArrowReturnRight/>


        </Link>

        {/*listing items */}

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={()=>{onDelete(listing.id)}}
                  onEdit={()=>{onEdit(listing.id)}}

               
                />
              ))}
            </ul>
          </>
        )}
    </main>
   </div>
   </>
  )
}

export default Profile
import React from 'react'
import { useState,useEffect,useRef } from 'react'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'
import { addDoc,collection,serverTimestamp  } from 'firebase/firestore'
import { db } from '../firebase.config'




const CreateListing = () => {
    const [formData,setFormData]=useState({
        type:'rent',
        name:'',
        bedrooms: 2,
        bathrooms: 1,
        offer: true,
        regularPrice:0,
        discountedPrice:0,
        parking:false,
        furnished:true,
        images:{},
        latitude:0,
        longitude:0,
        address:'',
    })
 const { type,name,bedrooms,bathrooms,offer,regularPrice,discountedPrice,parking,furnished,images,latitude,longitude,address }=formData

 const [geolocationEnabled,setGeolocationEnabled]=useState(false)
 const [loading,setloading]=useState(false)
 //
 const auth=getAuth()
 const navigate=useNavigate()
 const isMounted=useRef(true)

 const onMutate=(e)=>{
    let boolean=null
    if(e.target.value==='true'){
        boolean=true
    }
    if(e.target.value  === 'false'){
        boolean=false
    }
    //filse
    if(e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            images:e.target.files
        }))
    }
    //text/number/boolen
    if(!e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value
        }))
    }

 }

 useEffect(()=>{
    if(isMounted){
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setFormData({...formData,useRef:user.uid})
                console.log(formData)
            }
            else{
              navigate('/sign-in')
            }
        })
    }
    return ()=>{
        isMounted.current=false
    }
 }
 ,[isMounted])

const onSubmit=async(e)=>{ 
    e.preventDefault()
    
    console.log(formData)
    setloading(true)
    //check discountprice
    if(discountedPrice>= regularPrice){
        setloading(false)
        toast.error('discounted price needs to be less then rp')
        return
    }
    //check image
    if(images.length>6){
        setloading(false)
        toast.error('image max 6 allowed')
        return
    }
    //
    let geolocation={}
    let location
    if(geolocationEnabled){}
    else{
        geolocation.lat=latitude
        geolocation.lng=longitude
        location=address

    }
    //store images to firebase(for images)
    const storeImage=async(image)=>{
        return new Promise((resolve,reject)=>{
            //
            const storage = getStorage()
            const fileName=`${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storageRef=ref(storage,'images/'+fileName)


const uploadTask = uploadBytesResumable(storageRef, image);


uploadTask.on('state_changed', 
  (snapshot) => {
  
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
    // Handle unsuccessful uploads
  }, 
  () => {
    
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL)
      resolve(downloadURL);
      
    });
  }
);

            //

        })
    }

    const imgUrls=await Promise.all(
        [...images].map((image)=>storeImage(image))
    ).catch(()=>{
        setloading(false)
        toast.error('images not uploaded')
        return
    })
    console.log(imgUrls)
    setloading(false)


    //save listing to firestore
    const formDataCopy={...formData,imgUrls,geolocation,timestamp:serverTimestamp()}

    formDataCopy.location=address
    delete formDataCopy.address
    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef=await addDoc(collection(db,'listings'),formDataCopy)
    setloading(false)
    toast.success('listing saved')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)



}


 if(loading){
    return <Spinner/>
 }

  return (
    <div className='profile'>
        <header>
            <p className='pageHeader'>Create a listing</p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
                <label className='formLabel'>Sell/Rent</label>
                <div className="formButtons">
                    <button
                    type='button'
                    className={type==='sell'?'formButtonActive':'formButton'}
                    id='type'
                    value='sell'
                    onClick={onMutate}

                    >Sell</button>
                    <button
                    type='button'
                    className={type==='rent'?'formButtonActive':'formButton'}
                    id='type'
                    value='rent'
                    onClick={onMutate}

                    >Rent</button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input type="text"
                    required
                    maxLength='32'
                    minLength='10'
                    id='name'
                    value={name}
                    onChange={onMutate}
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>bedroom</label>
                            <input 
                            type="number"
                            className='formInputSmall'
                            id='bedrooms'
                            value={bedrooms}
                            min='1'
                            max='50'
                            required
                            onChange={onMutate}
                               />
                        </div>

                        <div>
                            <label className='formLabel'>bathrooms</label>
                            <input 
                            type="number"
                            className='formInputSmall'
                            id='bathrooms'
                            value={bathrooms}
                            min='1'
                            max='50'
                            required
                            onChange={onMutate}
                               />
                        </div>
                    </div>

                    <label className='formLabel'>Parking Slot</label>
                    <div className='formButtons'>
                        <button className={parking?'formButtonActive':'formButton'}
                        type='button'
                        id='parking'
                        value={true}
                        onClick={onMutate}
                        >Yes</button>
                        <button
                         className={!parking && parking !==null? 'formButtonActive':'formButton'}
                         type='button'
                         id='parking'
                         value={false}
                         onClick={onMutate}
                        >No</button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className="formButtons">
                        <button
                        className={furnished?'formButtonActive':'formButton'}
                        type='button'
                        id='furnished'
                        value={true}
                        onClick={onMutate}

                        >Yes</button>
                        <button
                        type='button'
                        onClick={onMutate}
                        id='furnished'
                        value={false}
                        className={!furnished && furnished !==null ? 'formButtonActive':'formButton'}
                        >NO</button>
                    </div>

                    <label className='formLabel'>
                        Address
                    </label>
                    <textarea onChange={onMutate} className="formInputaddress" id="address" type='text'
                    value={address}
                    ></textarea>
                {!geolocationEnabled && (
                     <div className='formLatLng flex'>
                     <div>
                       <label className='formLabel'>Latitude</label>
                       <input
                         className='formInputSmall'
                         type='number'
                         id='latitude'
                         value={latitude}
                         onChange={onMutate}
                         required
                       />
                     </div>
                     <div>
                       <label className='formLabel'>Longitude</label>
                       <input
                         className='formInputSmall'
                         type='number'
                         id='longitude'
                         value={longitude}
                         onChange={onMutate}
                         required
                       />
                     </div>
                   </div>
                    
                )}
                <label className='formLabel'>Offer</label>
                <div className='formButtons'>
                    <button className={offer?'formButtonActive':'formButton'}
                    type='button'
                    id='offer'
                    value={true}
                    onClick={onMutate}
                    >Yes</button>

                    <button className={!offer && offer!==null ?'formButtonActive':'formButton'}
                    type='button'
                    id='offer'
                    value={false}
                    onClick={onMutate}
                    >No</button>
                </div>
                <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
              
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>
          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
                
              />
            </>
          )}
          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            the first image will be the cover(max 6)
          </p>
          <input 
          type="file"
          className='formInputFile'
          id='images'
          accept='.jpg,.png,.jpeg'
          multiple
          required
          onChange={onMutate}
          
          />
          <button type='submit' className='primaryButton createListingButton'>Create Listing</button>
            </form>
        </main>
    </div>
  )
}

export default CreateListing
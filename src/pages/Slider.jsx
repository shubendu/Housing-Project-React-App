import React from 'react'
import { useState,useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { collection,getDocs,query,orderBy,limit, QuerySnapshot } from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import { async } from '@firebase/util'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Slider = () => {
    const [loading,setLoading]=useState(true)
    const [listings,setListings]=useState(null)
    const navigate=useNavigate()

    useEffect(()=>{
        const fetchlisting= async()=>{
            const listingRef = collection(db,'listings')
            const q = query(listingRef,orderBy('timestamp','desc'),limit(5))
            const querySnap=await getDocs(q)
            let listings=[]
            querySnap.forEach((doc)=>{

                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            })
            setListings(listings)
            console.log(listings)
            setLoading(false)
        }
        fetchlisting()
    },[])

    if(loading){ return <Spinner/>}

  return (
   listings && (
    <>
    <p className='exploreHeading'>Recomanded</p>
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    
      
     
    >
     { listings.map(({data,id,index})=>(
       <SwiperSlide
       key={id}
       onClick={()=>navigate(`/category/${data.type}/${id}`)}
       ><div className='swiperSlideDiv'>
      <img src={data.imgUrls[0]} alt="" height='300' width='1000' />
        
      </div>
     
     
     
        <p className='swiperSlideText'>{data.name}</p>
        <p className='swiperSlidePrice'>${data.discountedPrice ?? data.regularPrice}
        {data.type==='rent' && '/month'}</p>
     
       </SwiperSlide>


     )) }
    </Swiper>

    </>
   )
  )
}

export default Slider
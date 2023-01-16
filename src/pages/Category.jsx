import React from 'react'
import { useState,useEffect } from 'react'
import { collection, query, where, getDocs,orderBy,limit,startAfter } from "firebase/firestore";
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Category = () => {
    const[listings,setListings]=useState(null)
    const [loading,setLoading]=useState(true)
    const params=useParams()

    useEffect(()=>{
        const fetchListing=async()=>{
     try {
        
             //getrefrence
        const listingRef=collection(db,'listings')
        const q=query(listingRef,where('type','==',params.categoryName),orderBy('timestamp','desc'),limit(10))
        //execute query
        const querySnap=await getDocs(q)

        const listings=[]
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

       
        
      catch (error) {
        toast.error('could not fetch listing')
        
     }}
     fetchListing()

        
    },[])


  return (
    <div className='category'>
        <header>
            <p className='pageHeader'>
                {params.categoryName==='rent'?"places for Rent":"places for sale"}
            </p>
        </header>
        {loading?<Spinner/>:listings && listings.length>0 ?(
            <main>
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                        <ListingItem 
                        listing={listing.data}
                        id={listing.id}
                        key={listing.id} />
                    ))}
                </ul>
            </main>
        ):(<p> NO Listing for { params.categoryName } </p>)}
       
    </div>
  )
}

export default Category
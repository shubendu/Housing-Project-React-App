import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { MdBathtub } from 'react-icons/md'
import { FaBed } from  'react-icons/fa'
import  {AiOutlineEdit} from 'react-icons/ai'
import   { RiDeleteBin6Line} from 'react-icons/ri'


const ListingItem = ({listing,id,onDelete,onEdit }) => {
  return (
   <li className='categoryListing'>
    <Link to={`/category/${listing.type}/${id}`}
    className='categoryListingLink'
     >
        <img src={listing.imgUrls[0]} alt={listing.name} className='categoryListingImg' />
        <div className='categoryListingDetails'>
            <p className='categoryListingLocation'>{listing.location}</p>
            <p className='categoryListingName'>{listing.name}</p>
            <p className='categoryListingPrice' >
               $ { listing.offer ? listing.discountedPrice:listing.regularPrice}
                { listing.type ==='rent' && '/month' }
            </p>
            <div className="categoryListingInfoDiv">
            < FaBed size={30}/>
            <p className='categoryListingInfoText'>
           
                {listing.bedrooms>1?`${listing.bedrooms}bedrooms`:'1 bedroom'}
            </p>
            <MdBathtub size={30}/>
            <p className='categoryListingInfoText'>
            {listing.bathrooms>1?`${listing.bathrooms}bathrooms`:'1 bathroom'}
            </p>

        </div>
        </div>
        
    </Link>
    <div className='categoryListingLink'>
    { onDelete && (
        <RiDeleteBin6Line
        size={32}
        className='removeIcon'
       
        onClick={()=>onDelete(listing.id,listing.name)}
        />
    ) }

    { onEdit && (
        <AiOutlineEdit  className='editIcon' size={32} onClick={()=>onEdit(id)}/>

    ) }
    </div>

   </li>
  )
}

export default ListingItem
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Explore from './pages/Explore';
import Offer from './pages/Offer';
import ForgetPassword from './pages/ForgetPassword';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import PrivateRoute from './pages/PrivateRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';




function App() {
  return (
    <>
    <Router>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Explore/>} />
        <Route path='/offer' element={<Offer/>} />
        <Route path='/category/:categoryName/:listingId' element={<Listing/>}  />
        <Route path='/sign-in' element={<Signin/>} />
        <Route path='/sign-up' element={<Signup/>} />
        <Route path='/profile' element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>

        </Route>
        <Route path='/forget-password' element={<ForgetPassword/>}/>
        <Route path='/category/:categoryName' element={<Category/>}/>
        <Route path='/create-listing' element={<CreateListing/>} />
        <Route path='/contact/:landlordId' element={<Contact/>} />
        <Route path='/edit-listing/:listingId' element={<EditListing/>} />
        
      </Routes>
      <Navbar/>
     
    </Router>
    </>
  );
}

export default App;

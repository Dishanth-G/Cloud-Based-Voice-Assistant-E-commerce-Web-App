import './App.css';
import { useState } from "react";
import Header from "./component/layout/Header/Header.js"
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import WebFont from "webfontloader"
import React from 'react';
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js";
import Loader from './component/layout/Loader/Loader';
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js"
import {  useSelector } from "react-redux";
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import  updateProfile  from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js'
import ResetPassword from './component/User/ResetPassword.js'
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import MyOrders from "./component/Order/MyOrders.js"
import Dashboard from "./component/admin/Dashboard.js"
import ProductList from "./component/admin/ProductList.js"
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/OrderList.js";
import ProcessOrder from './component/admin/ProcessOrder';
import UsersList from './component/admin/UsersList';
import  UpdateUser  from './component/admin/UpdateUser';
import ProductReviews from './component/admin/ProductReviews';
import useAlan from './hooksvc/useAlan';


function App() {


  const {isAuthenticated,user} = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }
  
  useAlan();
  React.useEffect(()=>{
    
    WebFont.load({
      google:{
        families:["Roboto", "Droid Sans", "Chilanka"]
      }
    });

store.dispatch(loadUser())

getStripeApiKey();
  },[]);

  return (
 
    <div> 

      <Header/>
      {isAuthenticated && <UserOptions user={user}/>}
      
      <Routes>  

      <Route  path="/" element={<Home/>} />
      <Route  path="/load" element={<Loader/>} />
      <Route  path="/product/:id" element={<ProductDetails/>} />
      <Route  path="/products" element={<Products/>} />
      <Route  path="/products/:keyword" element={<Products/>} />

      <Route  path="/search" element={<Search/>} />




      <Route 
      path="/account"
       element={ 
      <ProtectedRoute component={Profile}/>       
      }/> 

<Route 
      path="/me/update"
       element={ 
      <ProtectedRoute component={updateProfile}/>       
      }/> 

    <Route 
      path="/password/update"
       element={ 
      <ProtectedRoute component={UpdatePassword}/>       
      }/> 



<Route  path="/password/forgot" element={<ForgotPassword/>} />

<Route  path="/password/reset/:token" element={<ResetPassword/>} />



      <Route path="/login" element={<LoginSignUp/>} />

      <Route path="/cart" element={<Cart/>} />

      <Route 
      path="/shipping"
       element={ 
      <ProtectedRoute component={Shipping}/>       
      }/> 

<Route 
      path="/order/confirm"
       element={ 
      <ProtectedRoute component={ConfirmOrder}/>       
      }/> 


{stripeApiKey &&   <Route 
      path="/process/payment"
       element={ 
        <Elements stripe={loadStripe(stripeApiKey)}>
      <ProtectedRoute component={Payment}/>    
      </Elements>   
      }/> }
      
      <Route 
      path="/success"
       element={ 
      <ProtectedRoute component={OrderSuccess}/>       
      }/> 


<Route 
      path="/orders"
       element={ 
      <ProtectedRoute component={MyOrders}/>       
      }/> 

      
<Route 
      path="/order/:id"
       element={ 
      <ProtectedRoute component={OrderDetails}/>       
      }/> 


<Route 
      path="/admin/dashboard"
       element={ 
      <ProtectedRoute isAdmin={true} component={Dashboard}/>       
      }/> 

<Route 
      path="/admin/products"
       element={ 
      <ProtectedRoute isAdmin={true} component={ProductList}/>       
      }/> 

      
<Route 
      path="/admin/product"
       element={ 
      <ProtectedRoute isAdmin={true} component={NewProduct}/>       
      }/> 

      
<Route 
      path="/admin/product/:id"
       element={ 
      <ProtectedRoute isAdmin={true} component={UpdateProduct}/>       
      }/> 

           
<Route 
      path="/admin/orders"
       element={ 
      <ProtectedRoute isAdmin={true} component={OrderList}/>       
      }/> 

<Route 
      path="/admin/order/:id"
       element={ 
      <ProtectedRoute isAdmin={true} component={ProcessOrder}/>       
      }/> 

<Route 
      path="/admin/users"
       element={ 
      <ProtectedRoute isAdmin={true} component={UsersList}/>       
      }/> 

<Route 
      path="/admin/user/:id"
       element={ 
      <ProtectedRoute isAdmin={true} component={UpdateUser}/>       
      }/> 

<Route 
      path="/admin/reviews"
       element={ 
      <ProtectedRoute isAdmin={true} component={ProductReviews}/>       
      }/> 
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

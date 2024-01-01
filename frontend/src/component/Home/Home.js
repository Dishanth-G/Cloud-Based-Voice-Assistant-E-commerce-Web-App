import React,{ Fragment,useEffect } from "react";
import {CgMouse} from "react-icons/all";
import "./Home.css"
import ProductCard from "./ProductCard.js"
import MetaData from "../layout/MetaData";
import {getProduct} from "../../actions/productAction";
import {useSelector,useDispatch} from "react-redux"
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearErrors } from "../../actions/productAction";
// import useAlan from "../../hooksvc/useAlan";

const Home = ()=>{

// useAlan();
    const alert=useAlert()

    const dispatch= useDispatch();
    const {loading,error,products}=useSelector((state)=> state.products);

    useEffect(() => {
        
        

        if(error){
            alert.error(error)
         dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch,error,alert]);

    return (<Fragment>

        {loading ? <Loader/>: <Fragment>
       
<MetaData title="ECOMMERCE WEB APP" />

        
<div className="banner">
<p>Hey there</p>
<h1>Welcome to the ECOMMERCE HOME PAGE</h1>

<a href="#container"><button>Browse Featured Products <CgMouse /></button></a>
    </div>

<h2 className="homeHeading">Featured Products</h2>

<div className="container" id="container">
    
    {products && products.map((product) => <ProductCard key={product._id} product={product} />)}

</div>
        
</Fragment>} 
    </Fragment>
    );
};


export default Home;
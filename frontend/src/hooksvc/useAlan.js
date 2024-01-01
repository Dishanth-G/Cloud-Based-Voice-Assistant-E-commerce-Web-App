import {useEffect,useState,useCallback} from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useNavigate,useParams } from 'react-router-dom';
import { getProduct,newReview } from '../actions/productAction';
import { addItemsToCart,removeItemsFromCart } from '../actions/cartAction';
import { useSelector, useDispatch } from "react-redux";
import {useAlert} from "react-alert"
import axios from "axios";

const COMMANDS = {
    VIEW_PRODUCT:'view-products',
    VIEW_CART:'view-cart',
    VIEW_HOME:'view-home',
    VIEW_LOGIN:'view-login',
    SEARCH_PROD:'search-prod',
    FILTER_CATEGORY:'filter-category',
    WRITE_REVIEW:'write-review',
    ADD_ITEM:'add-item',
    DESC_PROD:'desc-prod',
    READ_REV:'read-rev',
    CHECK_OUT:'check-out',
    SELECT_PROD:'select-prod',
    REMOVE_PROD:'remove-prod',
    CHANGE_QUAN:'change-quantity',
    CHECK_PAGE:'check-page',
    CHECK_PAGEWR:'check-pagewr',
    CHECK_PAGECR:'check-pagecr'
}

export default function useAlan() {
    let keyword="";
    let currentPage=1;
    let rat=0;
    let price=[0,250000];
    let cat=""

    const history=useNavigate();
    const dispatch = useDispatch(); 
    const [alanInstance,setAlanInstance]=useState()
    const alert=useAlert();
  const { cartItems } = useSelector((state) => state.cart);
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount
  } = useSelector((state) => state.products);

  var Sentiment = require('sentiment');




    const viewProducts=useCallback(()=>
    {
        alanInstance.playText('Opening Product list')

        history("/products")

    },[alanInstance])

    const viewLogin=useCallback(()=>
    {
        alanInstance.playText('Opening Login page')

        history("/login")

    },[alanInstance])

    const viewCart=useCallback(()=>
    {
        // alanInstance.playText('Opening carts page')

        history("/cart")

    },[alanInstance])

    const viewHome=useCallback(()=>
    {
        alanInstance.playText('Opening home page')

        history("/")

    },[alanInstance])

    const CheckPage=useCallback(()=>
    {
        if(window.location.pathname.split('/')[1]!="product"){
         alanInstance.playText("You are not viewing any product.")

         setTimeout(function afterTwoSeconds() {
            alanInstance.deactivate();
          }, 2000)
            

        }
        else{
        alanInstance.playText("Provide Quantity")

        }

    },[alanInstance])

    const CheckPagewr=useCallback(()=>
    {
        if(window.location.pathname.split('/')[1]!="product"){
         alanInstance.playText("You are not viewing any product.")

         setTimeout(function afterTwoSeconds() {
            alanInstance.deactivate();
          }, 2000)
            

        }
        else{
        alanInstance.playText("Provide Ratings")

        }

    },[alanInstance])

    const CheckPagecr=useCallback(()=>
    {
        if(window.location.pathname.split('/')[1]!="cart"){
         alanInstance.playText("You are not in carts page")

         setTimeout(function afterTwoSeconds() {
            alanInstance.deactivate();
          }, 2000)
            

        }
        else{
        alanInstance.playText("Provide item position")

        }

    },[alanInstance])



    const searchProduct=useCallback(({detail:{prodname}})=>
    {
             

        history("/products/"+prodname)

    },[alanInstance])

    


    const filterCategory= useCallback(async({detail:{category,rating}}) => {

       await history("/products")

      let cat=category
      let rat=rating

     

        alanInstance.playText("Filtering products by"+cat)

       

      dispatch(getProduct(keyword,currentPage,price,cat,rat));

        alanInstance.playText("Done");


    },[alanInstance,history,dispatch,cat,keyword,currentPage,price,rat])

    const writeReview = useCallback(async({detail:{rating,description}})=>{

        
        let wrat=rating
        let desc=description
       

      let id=window.location.pathname.split('/')[2];

      var s=""


        var sentiment = new Sentiment();
var result = sentiment.analyze(desc);
if(result.score>1){
s="Positive"
}
else if(result.score<-1){
  s="Negative"
}
else{
  s="Neutral"
}

      

        const myForm = new FormData();
        myForm.set("rating",wrat);
        myForm.set("comment",desc);
        myForm.set("productId",id);
        myForm.set("sentiment",s);

        dispatch(newReview(myForm));

        await history("/product/"+id)
alanInstance.playText("Done");
alanInstance.deactivate();
    },[alanInstance,dispatch,history])

    const addItem=useCallback(async({detail:{quant}})=>{

        if(window.location.pathname.split('/')[1]=="product"){
            let id=window.location.pathname.split('/')[2];
     
            const { data } = await axios.get(`/api/v1/product/${id}`);
                let prodStock=data.product.Stock
                console.log(prodStock)
        if(quant<=prodStock){
            dispatch(addItemsToCart(id,quant));
            alanInstance.playText('Item added to cart successfully')
        
            alert.success("Items added to cart")
        
        }
        else{
        
            alanInstance.playText('Cant add this item because you are asking more quantity')
        
        }
        
        }
        else{
            alanInstance.playText('You are not in the product page')

        }

     
    },[alanInstance,dispatch])

const descProd = useCallback(async()=>{

    if(window.location.pathname.split('/')[1]!="product"){
        alanInstance.playText("You are not viewing any product.")

        setTimeout(function afterTwoSeconds() {
           alanInstance.deactivate();
         }, 2000)
           

       }
       else{
       

    let id=window.location.pathname.split('/')[2];
     
    const { data } = await axios.get(`/api/v1/product/${id}`);
    
    let proname=data.product.name;
    let pdesc=data.product.description;
    let pprice=data.product.price;
    let prat=data.product.ratings;

    let pnumrev=data.product.numOfReviews;

    let pstock=data.product.Stock;

    console.log(proname,pdesc,pprice,prat,pnumrev)
    alanInstance.playText("The product name is "+proname)
    alanInstance.playText("The product is priced at "+pprice+" rupees")
    alanInstance.playText("The product description is "+pdesc)
    if(pnumrev==0){
        alanInstance.playText("No one has given ratings or reviews for the product.")
    }
    else{
    alanInstance.playText("The product rating is "+prat+"stars with "+pnumrev+"reviews")
    alanInstance.playText("If you want me to read the reviews just say, Read reviews")
    
}

    if(pstock==0){
        alanInstance.playText("The product is out of stock.You cant add this product into the cart presently.")
    }
    else{
        alanInstance.playText("The product is instock.If you want to add this product,please say, Add this item to cart")

    }

    

       }

},[alanInstance])

const readrev= useCallback(async()=>{

    if(window.location.pathname.split('/')[1]!="product"){
        alanInstance.playText("You are not viewing any product.")

        setTimeout(function afterTwoSeconds() {
           alanInstance.deactivate();
         }, 2000)
           

       }
       else{
       
    let id=window.location.pathname.split('/')[2];
     
    const { data } = await axios.get(`/api/v1/product/${id}`);
    
    let pnumrev=data.product.numOfReviews;
    if(pnumrev==0){
        alanInstance.playText("No one has given ratings or reviews for the product.")
    }
    else{
        let previews=data.product.reviews
        previews.forEach(r => {
            let ruser=r.name;
            let rrat=r.rating
            let rcat=r.comment
            alanInstance.playText("User with name as "+ ruser+ " gave a rating of "+ rrat + "stars")
            alanInstance.playText("The comment is "+rcat)

        });
    }
}
})

const checkOut=useCallback(async()=>{



 if(cartItems.length === 0){
    alanInstance.playText("You have no items in cart")

 }
 else{
    alanInstance.playText("Going to check out page")    

    await history("/login?redirect=shipping")
 }

    



})

const selectProd=useCallback(async({detail:{ind}})=>{

    if((window.location.pathname.split('/')[1]=="products")||(window.location.href=="http://localhost:3000/")||(window.location.href=="http://localhost:3000/#container")){        

    ind=parseInt(ind.charAt(0))

    if(ind > products.length){
    alanInstance.playText("I cant select it") 
    }
    else{
        if(ind==1){
            history("product/"+products[0]._id)
        }
        else if(ind==2){
            history("product/"+products[1]._id);
        }
        else if(ind==3){
            history("product/"+products[2]._id);    
        }
        else if(ind==4){
            history("product/"+products[3]._id);
        }
        else if(ind==5){
            history("product/"+products[4]._id);
        }
        else if(ind==6){
            history("product/"+products[5]._id);
        }
        else if(ind==7){
            history("product/"+products[6]._id);

        }
        else if(ind==8){
            history("product/"+products[7]._id);
        }
    }
}
else{

    alanInstance.playText("You are not in products page")

    setTimeout(function afterTwoSeconds() {
       alanInstance.deactivate();
     }, 2000)
}
   
}

    
)

const removeProd=useCallback(({detail:{crind}})=>{
    if((window.location.pathname.split('/')[1]=="cart")){



    
    crind=parseInt(crind.charAt(0))


    if(crind > cartItems.length){
    alanInstance.playText("I cant remove it")    

    }
    else{
        if(crind==1){
            dispatch(removeItemsFromCart(cartItems[0].product));
            window.location.reload();
           


        }
        else if(crind==2){
            dispatch(removeItemsFromCart(cartItems[1].product));
            window.location.reload();

            
        }
        else if(crind==3){
            dispatch(removeItemsFromCart(cartItems[2].product));
            window.location.reload();

            
    
        }
        else if(crind==4){
            dispatch(removeItemsFromCart(cartItems[3].product));
            window.location.reload();

            
        }
        else if(crind==5){
            dispatch(removeItemsFromCart(cartItems[4].product));
            window.location.reload();

            

        }
        else if(crind==6){
            dispatch(removeItemsFromCart(cartItems[5].product));
            window.location.reload();

            

        }
        else if(crind==7){
            dispatch(removeItemsFromCart(cartItems[6].product));
            window.location.reload();

            

        }
        else if(crind==8){
            dispatch(removeItemsFromCart(cartItems[7].product));
            window.location.reload();

            

        }

    }
    }
    else{
        alanInstance.playText('You are not in carts page')
    
    }

},[alanInstance,dispatch])

const changeQuan=useCallback(async({detail:{prodid,cqrquantity}})=>{


  

    
    prodid=parseInt(prodid.charAt(0))

let cpid
    if(prodid > cartItems.length){
    alanInstance.playText("I cant change the quantity ")    

    }
    else{
        if(prodid==1){

            cpid=cartItems[0].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
    }
        else if(prodid==2){
           
            cpid=cartItems[1].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
        else if(prodid==3){
           
            cpid=cartItems[2].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
        else if(prodid==4){
          
            cpid=cartItems[3].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
        else if(prodid==5){
         
            cpid=cartItems[4].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
        else if(prodid==6){
          
            cpid=cartItems[5].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
        else if(prodid==7){
       
            cpid=cartItems[6].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
        else if(prodid==8){
         
            cpid=cartItems[7].product
                
    const { data } = await axios.get(`/api/v1/product/${cpid}`);
        let prodStock=data.product.Stock
        
if(cqrquantity<=prodStock){
    dispatch(addItemsToCart(cpid,cqrquantity));

           


        }
        else{
            alanInstance.playText('Cant add this item because you are asking more quantity')

        }
        }
    }


},[alanInstance,dispatch])


useEffect(()=>{
window.addEventListener(COMMANDS.VIEW_PRODUCT,viewProducts)
window.addEventListener(COMMANDS.VIEW_CART,viewCart)
window.addEventListener(COMMANDS.VIEW_HOME,viewHome)
window.addEventListener(COMMANDS.VIEW_LOGIN,viewLogin)
window.addEventListener(COMMANDS.SEARCH_PROD,searchProduct)
window.addEventListener(COMMANDS.FILTER_CATEGORY,filterCategory)
window.addEventListener(COMMANDS.WRITE_REVIEW,writeReview)
window.addEventListener(COMMANDS.ADD_ITEM,addItem)
window.addEventListener(COMMANDS.DESC_PROD,descProd)
window.addEventListener(COMMANDS.READ_REV,readrev)
window.addEventListener(COMMANDS.CHECK_OUT,checkOut)
window.addEventListener(COMMANDS.SELECT_PROD,selectProd)
window.addEventListener(COMMANDS.REMOVE_PROD,removeProd)
window.addEventListener(COMMANDS.CHANGE_QUAN,changeQuan)
window.addEventListener(COMMANDS.CHECK_PAGE,CheckPage)
window.addEventListener(COMMANDS.CHECK_PAGEWR,CheckPagewr)
window.addEventListener(COMMANDS.CHECK_PAGECR,CheckPagecr)





return ()=>{
    window.removeEventListener(COMMANDS.VIEW_PRODUCT,viewProducts)
window.removeEventListener(COMMANDS.VIEW_CART,viewCart)
window.removeEventListener(COMMANDS.VIEW_HOME,viewHome)
window.removeEventListener(COMMANDS.VIEW_LOGIN,viewLogin)
window.removeEventListener(COMMANDS.SEARCH_PROD,searchProduct)
window.removeEventListener(COMMANDS.FILTER_CATEGORY,filterCategory)
window.removeEventListener(COMMANDS.WRITE_REVIEW,writeReview)
window.removeEventListener(COMMANDS.ADD_ITEM,addItem)
window.removeEventListener(COMMANDS.DESC_PROD,descProd)
window.removeEventListener(COMMANDS.READ_REV,readrev)
window.removeEventListener(COMMANDS.CHECK_OUT,checkOut)
window.removeEventListener(COMMANDS.SELECT_PROD,selectProd)
window.removeEventListener(COMMANDS.REMOVE_PROD,removeProd)
window.removeEventListener(COMMANDS.CHANGE_QUAN,changeQuan)
window.removeEventListener(COMMANDS.CHECK_PAGE,CheckPage)
window.removeEventListener(COMMANDS.CHECK_PAGEWR,CheckPagewr)
window.removeEventListener(COMMANDS.CHECK_PAGECR,CheckPagecr)


}
},[viewProducts,viewCart,viewHome,viewLogin,searchProduct,filterCategory,writeReview,addItem,descProd,readrev,checkOut,selectProd,removeProd,changeQuan,CheckPage,CheckPagewr,CheckPagecr])

    useEffect(()=>{


if(alanInstance !=null) return

setAlanInstance(

        alanBtn({
            key:'',
            onCommand:({command,payload}) =>{
                window.dispatchEvent(new CustomEvent(command,{detail:payload}))
                
            }
        })
        )
    },[])
    return null
}

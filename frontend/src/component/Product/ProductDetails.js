import React,{Fragment,useEffect,useState} from 'react';
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css"
import {useSelector,useDispatch} from "react-redux"
import { clearErrors,getProductDetails,newReview } from '../../actions/productAction';
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard.js"
import Loader from "../layout/Loader/Loader"
import {useAlert} from "react-alert"
import MetaData from "../layout/MetaData"
import {addItemsToCart} from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
  ButtonGroup
} from "@mui/material";

import { NEW_REVIEW_RESET } from '../../constants/productConstants';


const ProductDetails = () => {

  var Sentiment = require('sentiment');

 

    const { id } = useParams();

    const  dispatch = useDispatch();
    const alert=useAlert();

    const {product,loading,error}=useSelector(state => state.productDetails)

    const {success,error: reviewError} = useSelector(
      (state)=> state.newReview
    )

    const options = {
      edit:false,
        size: "large",
        value: product.ratings,
        readOnly: true,
        precison:0.5,
        
      };

      const [quantity,setQuantity]=useState(1);
      const [open,setOpen]=useState(false);
      const [rating,setRating]=useState(0);
      const [typesen,setSentiment]=useState(0)
      let [comment,setComment]=useState("");


      const increaseQuantity = ()=>{

        if(product.Stock <= quantity)
        return;

        const qty=quantity+1;
        setQuantity(qty)
      };

      const decreaseQuantity =()=>{

        
        if(quantity <= 1)     
        return;

        const qty=quantity-1;
        setQuantity(qty)

      }

      const addToCartHandler = () =>{
        dispatch(addItemsToCart(id,quantity));
        alert.success("Items added to cart")
      }

      const submitReviewToggle = ()=>{
        open ? setOpen(false): setOpen(true);
      }

      const getAllsReviews =()=>{
        setSentiment(0)   

      
          }

          const getposReviews =()=>{
            setSentiment(1)
           
          
              }

              const getneuReviews =()=>{
                setSentiment(2)
              
              
                  }

                  const getnegReviews =()=>{

                setSentiment(3)
                   
                  
                      }
    
      const reviewSubmitHandler = ()=>{

        if(comment.length === 0){
          comment="None"
        }
        var s=""

        var sentiment = new Sentiment();
var result = sentiment.analyze(comment);
console.log(result.score);
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
        myForm.set("rating",rating);
        myForm.set("comment",comment);
        myForm.set("productId",id);
        myForm.set("sentiment",s);

        dispatch(newReview(myForm));
        setOpen(false)
      }

    useEffect(() => {
      if(error){
         alert.error(error)
         dispatch(clearErrors());
      }

if(reviewError){
  alert.error(reviewError);
  dispatch(clearErrors());
}

if(success){
  alert.success("Review Submitted");
  dispatch({type:NEW_REVIEW_RESET});
}

        dispatch(getProductDetails(id))


    }, [dispatch,id,error,alert,reviewError,success]);

    return (
<Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title = {`${product.name}---ECOMMERCE`} />
            <div className='ProductDetails'>

            <div>

                <Carousel>                   
                    {product.images &&
                    product.images.map((item,i)=>(                       
                    <img
                        className="CarouselImage"
                        key={item.url}
                        src={item.url}
                        alt={`${i} Slide`}
                        />                    
                    ))}                    

                </Carousel>

            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                 
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
                        <div className='detailsBlock-3'>

                        <h1>{`₹${product.price}`}</h1>


                        <div className='detailsBlock-3-1'>
                        <div className='detailsBlock-3-1-1'>
                            <button onClick={decreaseQuantity}>-</button>
                            <input readOnly value={quantity} type="number"/>
                            <button onClick={increaseQuantity}>+</button>
                        </div>
                        <button disabled={product.Stock <1?true:false} onClick={addToCartHandler}>Add to Cart</button>

                        </div>
<p>
    Status : 
    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
</p>

                        </div>

                        <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>

              <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea className="submitDialogTextArea" cols="30" rows="5" value={comment}  required   onChange={(e) => setComment(e.target.value)}></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler}  color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>




              </div>

            </div>

            
          <h3 className="reviewsHeading">REVIEWS</h3>
          {product.reviews && product.reviews[0] ? (
           
            <div >
               <div className="BtnGRP" >
               <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ml:60}}>
  <Button onClick={getAllsReviews} >All Reviews</Button>
  <Button onClick={getposReviews}>Positive Reviews</Button>
  <Button onClick={getneuReviews}> Neutral Reviews</Button>
  <Button onClick={getnegReviews}>Negative Reviews</Button>

</ButtonGroup>
             </div>
           
              {
              (()=>{
                if(typesen==0){
return(
  <div className="reviews">
                { product.reviews &&
                  product.reviews.map((review) => (
                   <ReviewCard key={review._id} review={review} />
                  ))}</div>
)
                }
                else if(typesen==1){
                  return(
                    <div className="reviews">
                  {product.reviews &&
                  product.reviews.map((review) => (
                    review.sentiment=="Positive" && <ReviewCard key={review._id} review={review} />
                  ))}</div>)
                
                }
                else if(typesen==2){
                  return(
                    <div className="reviews">
                  {product.reviews &&
                  product.reviews.map((review) => (
                    review.sentiment=="Neutral" && <ReviewCard key={review._id} review={review} />
                  ))}</div>)
                }
                else if(typesen==3){
                  return(
                    <div className="reviews">
                  {                  product.reviews &&
                  product.reviews.map((review) => (
                    review.sentiment=="Negative" && <ReviewCard key={review._id} review={review} />
                  ))}</div>)
                }
                else{
                  console.log("Hello")
                }

              })()
            }

               
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
    )

    
    
}
</Fragment>
    )
}

export default ProductDetails;

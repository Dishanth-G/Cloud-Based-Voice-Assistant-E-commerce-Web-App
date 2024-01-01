import React, { Fragment, useEffect, useState} from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from '@mui/material/Slider';
import { useAlert } from "react-alert";
import Typography from '@mui/material/Typography';
import MetaData from "../layout/MetaData";
import { Rating } from "@mui/material";

const categories = [
  "laptop",
  "SmartPhones",
  "Camera",
  "Footwear",
  
  "Tops",


  
];

const Products = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

 const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 250000]);
  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount
  } = useSelector((state) => state.products);

  const { keyword } = useParams();

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keyword,currentPage,price,category,ratings));
  }, [dispatch,keyword,currentPage,price,category,ratings,alert,error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}

          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              step={15000}
  marks
              min={0}
              max={250000}
            />



<Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Rating
                value={ratings}
                onChange={(e, newRating) => {
                  console.log(newRating);
                  if(newRating=== null){
                    setRatings(0);
                  }
                  else{
                  setRatings(newRating);
                  }
                }}
                
                
              />
            </fieldset>


            </div>

       

           {resultPerPage<count &&(
                <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
           )}
            </Fragment>
          )
     
       
      }
    </Fragment>


  );
    }

export default Products;
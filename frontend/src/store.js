import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productsReducer,productDetailsReducer, newProductReducer,productReducer } from "./reducers/productReducer";
import { userReducer,profileReducer,forgotPasswordReducer, allUsersReducer, userDetailsReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, newOrderReducer, orderReducer } from "./reducers/orderReducer";
import { myOrdersReducer } from "./reducers/orderReducer";
import { orderDetailsReducer } from "./reducers/orderReducer";
import { newReviewReducer } from "./reducers/productReducer";
import { productReviewsReducer } from "./reducers/productReducer";
import { reviewReducer } from "./reducers/productReducer";

const reducer = combineReducers({

    products: productsReducer,
    productDetails:productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    product:productReducer,
    allOrders:allOrdersReducer,
    order:orderReducer,
    allUsers:allUsersReducer,
    userDetails:userDetailsReducer,
    productReviews: productReviewsReducer,
  review: reviewReducer,

});


let initialState= {

cart:{
  cartItems:localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [],
  shippingInfo: localStorage.getItem("shippingInfo")
  ? JSON.parse(localStorage.getItem("shippingInfo"))
  : {},
},

};



const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;



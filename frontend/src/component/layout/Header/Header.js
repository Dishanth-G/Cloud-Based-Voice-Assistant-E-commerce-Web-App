import React from 'react';
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../Images/ecommerceicon.png";

const options = {
    burgerColorHover: "#eb4034",
    logo,
 
    burgerColor:"orange",
    logoWidth: "7vmax",
    navColor1: "lightblue",
    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Search",
    link4Text: "Cart",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/search",
    link4Url: "/cart",
    link1Size: "1.3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#eb4034",
    link1Margin: "1vmax",
    profileIconUrl: "/login",
    profileIconColor: "rgba(35, 35, 35,0.8)",
    searchIconUrl: "/search",
    searchIconColor: "rgba(35, 35, 35,0.8)",
    cartIconColor: "rgba(35, 35, 35,0.8)",
    profileIconColorHover: "#eb4034",
    searchIconColorHover: "#eb4034",
    cartIconColorHover: "#eb4034",
    cartIconMargin: "1vmax",
  };
  



const Header = () => {
    return (
        <ReactNavbar  {...options}/>
    )
}

export default Header

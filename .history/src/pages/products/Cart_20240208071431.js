import React from "react";
import { Button, Container, Table, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart, fetchCart } from "../../rtk/slices/Cart-slice";
import { useEffect } from "react";
import NavHeader from "../../components/NavHeader";
import {  useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setLanguage , selectLanguage , selectTranslations } from "../../rtk/slices/Translate-slice";
import logo from '../../images/Vita Logo2.png' ;
import { FaTrash } from "react-icons/fa";
import { setSearchTerm } from "../../rtk/slices/Search-slice";
import { selectToken } from "../../rtk/slices/Auth-slice";
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { FaPlus , FaMinus } from "react-icons/fa";
import axios from "axios";
import './cart.css';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  //const cart = useSelector(state => state.cart);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(1);

  const cartProducts = useSelector((state) => state.cart);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

 /* const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );*/

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  useEffect(() => {
    dispatch(fetchCart())
  }, [language]);


  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };


  /*const totalprice = cart.reduce((acc, product) => {
    acc += product.price * product.quantity;
    return acc;
  }, 0);

  useEffect(() => {
    console.log("Cart:", cart);
  }, [cart]);

  

  const handleDeleteFromCart = (productId) => {
    dispatch(deleteFromCart({ id: productId }));
  };*/
  

  const handleConfirmClick = () => {
    navigate('/order/confirm');
  };

  const [cart, setCart] = useState([]);

  const [promoCode, setPromoCode] = useState('');
  const bearerToken = useSelector(selectToken);
  

  const fetchUserCart = async () => {
    try {
      const language = 'en'; 
  
      const response = await axios.get('https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/my', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept-Language': language,
        },
      });
  
      const cartData = response.data.data; 
      
      if (cartData && cartData.cart) {
        setCart(cartData.cart.cartItems || []); 
        calculateTotalPrice(cartData.cart.cartItems); 
        console.log('Success fetch carts', cartData.cart.cartItems);
        console.log('n of products' , );
      } else {
        console.error('Error fetching user cart: Unexpected response structure');
      }
      console.log('success fetch carts' , response.data.data.cart.cartItems);
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  };
  
  const handleDeleteFromCart = async (productId) => {
    try {
      await axios.delete(`https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Accept-Language': language,
        },
      });
      await fetchUserCart();
      console.log('success delete from cart ' , productId);
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };

  const calculateTotalPrice = (cartItems) => {
    const totalPrice = cartItems.reduce((acc, item) => {
      return acc + item.productPrice * item.quantity;
    }, 0);
    setTotalPrice(totalPrice);
  };


  const handleAddToFavorites = async (productId) => {
    try {
      const response = await axios.put( 
        `https://ecommerce-1-q7jb.onrender.com/api/v1/user/wishlist/add/${productId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        }
      );
      await handleDeleteFromCart(productId); 
      console.log('Response:', response.data); 
    } catch (error) {
      console.log('Error adding product to wishlist: ', error.message);
    }
  };
  

  useEffect(() => {
    fetchUserCart();
  }, []);

  useEffect(() => {
    calculateTotalPrice(cart);
  }, [cart]);
 

  const [updatedCart, setUpdatedCart] = useState([]);

  const handleSave = async (productId, product) => {
   
    const cartItem = {
      productId: productId,
      quantity: quantity, 
    };
  
    try {
      const response = await axios.put(
        'https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/update',
        cartItem,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Product added to cart:', response.data);
      setQuantity(quantity);
      setTotalPrice(totalPrice);
      await fetchUserCart();
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
    }
  };


 
  
  return(
    <div>
       <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        //filteredProducts={filteredProducts}
        handleProductClick={handleProductClick}
        cartunmber = {cart.length}
      />

      <div className="green-containerr cartGreen ">
        <div className="header-container">
          <div className="flexContainerCart">
          <div className="flexcart">
          {cart?.map((product) => (<div className="productcart" key={product.productId}>
              <div className="flexOnecart">
                <div className="imgcart">
                <Image
                  src={product.pictureUrl}
                  alt="Product poster"
                  style={{ width: "100%", height: "60%" }}
  />
                </div>
                <div className="infocartone">
                  <div  className="namecart" ><h4>{product.productName}</h4></div>
                  <h5>{product.productPrice}$</h5>
                  <h5>quantity : {product.quantity}</h5>

                  <div className="countercart">
                  <button style={{backgroundColor:'#3EBF87' , color : 'white'}} onClick={handleDecrement}>
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button style={{backgroundColor:'#3EBF87' , color : 'white'}} onClick={handleIncrement}>
                    <FaPlus />
                  </button>
                  <button style={{backgroundColor:'transparent' , fontSize: 'larger' , fontWeight: 'bold'}}
                  onClick={() => handleSave(product.productId , product)}>save</button>
                </div>
                </div>
                <div className="infocarttwo">
                  <div className="namecart" >
                  
              <FaTrash style={{color: 'red' , fontSize:'20px'}} 
              onClick={() => handleDeleteFromCart(product.productId)}/>
                  </div>
                  <div className="namecart" >
                  
              <FaHeart style={{color: '#3EBF87' , fontSize:'20px'}} 
              onClick={() => handleAddToFavorites(product.productId)} />
                  </div>

                  
                </div>
              </div>
            </div> ))}
          </div>
          <div className="total">
          <h4>Total Price : {totalPrice.toFixed(2)}</h4>
              <h6>Add Promo Code</h6>
              <div className="input"> <input /> </div>
              <button className="confirmbtn" onClick={handleConfirmClick}>Confirm</button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;
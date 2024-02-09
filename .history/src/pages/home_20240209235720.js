import React, { useEffect, useState } from "react";
import "./stylehome.css";
import logo from "../images/Vita Logo2.png";
import product from "../images/product.png";
import { FaSearch } from "react-icons/fa";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import Slider from "./slider/Slider";
import StarRating from "./rate/StarRating";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import {
  fetchProducts,
  selectProducts,
  selectProductIds,
} from "../rtk/slices/Product-slice";
//import {  removeFromWishlist } from '../rtk/slices/Wishlist-slice';
//import { selectWishlist } from '../rtk/slices/Wishlist-slice';
import DetailsDialog from "./products/DetailsDialog";
import { addToCart, deleteFromCart } from "../rtk/slices/Cart-slice";
//import { clearWishlist } from '../rtk/slices/Wishlist-slice';
import { clearCart } from "../rtk/slices/Cart-slice";
import { logoutAction, setAuthData } from "../rtk/slices/Auth-slice"; // Assuming your auth slice includes setAuthData
import NavHeader from "../components/NavHeader";
import email from "../images/Email icon.png";
import address from "../images/Location icon.png";
import phone from "../images/phone icon.png";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { jwtDecode } from "jwt-decode";
//import { loadWishlistFromStorage } from '../rtk/slices/Wishlist-slice';
import { setSearchTerm } from "../rtk/slices/Search-slice";
import { selectUserId } from "../rtk/slices/User-slice";
//import { addToWishlist } from '../rtk/slices/Wishlist-slice';
import {
  addToWishlist,
  removeFromWishlist,
} from "../rtk/slices/Wishlist-slice";
import { clearWishlist } from "../rtk/slices/Wishlist-slice";
import HorizontalScroll from "../components/Carousel";
import { selectToken } from "../rtk/slices/Auth-slice";
import { Modal, Button } from "react-bootstrap";

function Home() {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(isLoggedIn);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const userId = useSelector((state) => state.auth.id);
  const bearerToken = useSelector(selectToken);
  const isUserLoggedIn = useSelector(selectToken) !== null;
  const products = useSelector((state) => state.products.products);
  const error = useSelector((state) => state.products.error);

  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    fetchUserFavourite();
    console.log("CART", cart);
  }, []);

  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const getCart = () => {};

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => setShowModal(false);

  const handleAddToFavorites = async (productId) => {
    try {
      if (!isUserLoggedIn) {
        setModalMessage("please sign in first");
        setShowModal(true);
        return;
      }
      if (isProductInWishlist(productId)) {
        await handleDeleteFromWishlist(productId);
      } else {
        const response = await axios.put(
          `https://ecommerce-1-q7jb.onrender.com/api/v1/user/wishlist/add/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
              "Accept-Language": language,
            },
          }
        );
        console.log("Response:", response.data); // Print the response data
        await fetchUserFavourite();
      }
    } catch (error) {
      console.log("Error adding product to wishlist: ", error.message);
    }
  };

  const handleDeleteFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `https://ecommerce-1-q7jb.onrender.com/api/v1/user/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Accept-Language": language,
          },
        }
      );
      await fetchUserFavourite();
    } catch (error) {
      console.error("Error deleting product from wishlist:", error);
    }
  };

  const fetchUserFavourite = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-1-q7jb.onrender.com/api/v1/user/wishlist/my",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Accept-Language": language,
          },
        }
      );

      const favouriteData = response.data.data;

      if (favouriteData && favouriteData.wishlist) {
        setWishlist(favouriteData.wishlist.wishlistItems || []);
        console.log(
          "Success fetch wishlist",
          favouriteData.wishlist.wishlistItems
        );
      } else {
        console.error(
          "Error fetching user favourite: Unexpected response structure"
        );
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const handleAddToCart = async (productId, product) => {
    if (!isUserLoggedIn) {
      setModalMessage("please sign in first");
      setShowModal(true);
      return;
    }

    const cartItem = {
      productId: productId,
      quantity: 1,
    };

    try {
      const response = await axios.put(
        "https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/update",
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
            "Accept-Language": language,
          },
        }
      );

      setModalMessage("product added to cart");
      setShowModal(true);
      console.log("Product added to cart:", response.data);
      dispatch(addToCart(productId));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    dispatch(setSearchTerm(term));
  };

  const [favoriteStatus, setFavoriteStatus] = useState(
    JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {}
  );

  const saveFavoritesToLocalStorage = (userId, favorites) => {
    const userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {};
    localStorage.setItem(
      `favorites_${userId}`,
      JSON.stringify({ ...userFavorites, ...favorites })
    );
  };

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {};
    setFavoriteStatus(savedFavorites);
  }, [userId]);

  const handleDetailsClick = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setDetailsOpen(true);
  };

  const handleCancelDetails = () => {
    setDetailsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const rating = selectedProduct ? selectedProduct.rate : 0;

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  return (
<div className="relative">
  <div className=" mx-auto items-center text-center w-[90%] m-5 h-[90vh]  rounded  bg-slate-400 absolute z-50 md:hidden ">

    <h3 className="mt-60 items-center text-center text-rap">We recommend to Use Our Mobile Application</h3>
    <h3>Download from Here </h3>

  </div>
      <div className="page-container">
        <NavHeader
          userId={userId}
          searchTermm={searchTerm}
          handleSearchChange={handleSearchChange}
          //filteredProductss={filteredProducts}
          handleProductClick={handleProductClick}
        />
  
        <div className="green-containerr">
          <div className="home-containerr testtt">
            <Slider />
            <div className="titleProduct">
              <h1>{translations[language]?.magasin}</h1>
              <h2>{translations[language]?.learnmore}</h2>
            </div>
            {loading && (
              <div
                className="loading-spinner"
                style={{ width: "50px", height: "50px", marginTop: "10px" }}
              ></div>
            )}
            {!loading && (
              <div className="card-container">
                {products.map((product) => (
                  <div
                    style={{
                      borderRadius: "15%",
                      backgroundColor: "#fff",
                      marginBottom: "10px",
                      boxShadow: "5px 5px 5px #8080809e",
                    }}
                    className="card"
                    key={product.id}
                  >
                    <div className="card-body">
                      <div className="card-icons">
                        <FaHeart
                          onClick={() => handleAddToFavorites(product.productId)}
                          style={{
                            color: isProductInWishlist(product.productId)
                              ? "red"
                              : "#3EBF87",
                          }}
                        />
  
                        <FaEye
                          className="cart-iconPro"
                          onClick={() => handleDetailsClick(product)}
                        />
                      </div>
                      <div className="card-imgstore">
                        <Link to={`/home/product/${product.productId}`}>
                          <img src={product.pictureUrl} alt="Product poster" />
                        </Link>
                      </div>
                      <div className=" card-infoStore">
                        <h2>{product.name}</h2>
  
                        <div className="rate">
                          {isLoggedIn && (
                            <StarRating
                              initialRating={product.rating}
                              isClickable={false}
                            />
                          )}
                        </div>
                        <div className="price">
                          {product.discount && (
                            <div className="discounted-price">{`$${product.afterDiscount}`}</div>
                          )}
                          {product.discount && (
                            <div className="old-price">{`$${product.price}`}</div>
                          )}
                          {!product.discount && (
                            <div className="price">{`$${product.price}`}</div>
                          )}
                        </div>
                      </div>
                      <button
                        className="proBtn"
                        onClick={() =>
                          handleAddToCart(product.productId, product)
                        }
                      >
                        add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <div className="footerr footerPhr">
            <div className=" header-container ">
              <div className="flexFooter">
                <div className="cartfooter">
                  <div className="important">
                    <h1>important links</h1>
                    <Link className="footerlink">privacy policy </Link>
                    <Link className="footerlink">cookies policy </Link>
                    <Link className="footerlink">Terms & conditions </Link>
                  </div>
                  <div className="information">
                    <h1>Informations sur la livraison</h1>
                    <h2>
                      Informations d'expédition Pour garantir que vos achats
                      arrivent sans problème, assurez-vous de fournir l'adresse et
                      le numéro de téléphone corrects pour garantir une expérience
                      d'achat pratique et efficace. Assurez-vous que vos
                      informations d'expédition sont à jour, y compris les détails
                      de l'adresse et le délai de livraison souhaité, pour vous
                      assurer de recevoir votre commande rapidement et sans
                      retards inutiles.
                    </h2>
                  </div>
                </div>
                <div className="cartfooter cartfootertwo">
                  <div className="important">
                    <h1>coordonnées</h1>
                    <h2>
                      Contactez-nous pour toute demande de renseignements ou
                      d'assistance dont vous avez besoin, nous sommes là pour vous
                      fournir soutien et conseils
                    </h2>
                  </div>
                  <div className="address">
                    <div className="flexaddress">
                      <img src={address} />
                      <h2>l'adresse:</h2>
                    </div>
                    <h2>
                      LAAYOUNE : MADINAT EL WAHDA BLOC B NR 91 LAAYOUNE (M) <br />
                      Tetouan: Mezanine bloc B Bureau n 4 BOROUJ 16 Avenue des Far
                      N° 873 Tétouan
                    </h2>
                  </div>
                  <div className="flexphoneemail">
                    <div className="address">
                      <div className="flexaddress">
                        <img src={phone} />
                        <h2>Phone:</h2>
                      </div>
                      <h2>00212689831227</h2>
                    </div>
                    <div className="address">
                      <div className="flexaddress">
                        <img src={email} />
                        <h2>Email:</h2>
                      </div>
                      <h2>contact@vitaparapharma.com</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DetailsDialog
          isOpen={detailsOpen}
          onCancel={handleCancelDetails}
          product={selectedProduct}
          rating={rating}
        />
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
</div>
  );
}

export default Home;

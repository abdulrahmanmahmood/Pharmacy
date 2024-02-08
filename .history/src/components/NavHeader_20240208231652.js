import React from "react";
import logo from "../images/Vita Logo2.png";
import loginimg from "../images/loginIcon.png";
import logoutimg from "../images/logouticon.png";
import cartimg from "../images/Cart.png";
import product from "../images/product.png";
import { FaSearch } from "react-icons/fa";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import { fetchProducts } from "../rtk/slices/Product-slice";
import { setToken } from "../rtk/slices/Auth-slice";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import "./navheader.css";
import SidebarUser from "./SidebarUser";
import { clearWishlist } from "../rtk/slices/Wishlist-slice";
import { IoIosNotificationsOutline } from "react-icons/io";
import { selectToken } from "../rtk/slices/Auth-slice";

function NavHeader({ userId, handleProductClick, cartunmber }) {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const allProducts = useSelector((state) => state.products);
  const bearerToken = useSelector(selectToken);

  const products = useSelector((state) => state.products.products);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryIdTwo, setSelectedCategoryIdTwo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const cart = useSelector((state) => state.cart);
  const [cart, setCart] = useState([]);

  const handleLogout = () => {
    dispatch(setToken(null));
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  useEffect(() => {
    const checkLoggedInStatus = () => {
      const userToken = localStorage.getItem("token");
      setIsLoggedIn(!!userToken);

      console.log("tokennn is ", userToken);
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-1-q7jb.onrender.com/api/v1/public/category/all",
          {
            headers: {
              "Accept-Language": language,
            },
          }
        );
        setCategories(response.data.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    checkLoggedInStatus();
    fetchCategories();
  }, [dispatch, language]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };
  const [selectedCategoryColor, setSelectedCategoryColor] = useState("");

  /*const handleSearchChangeInternal = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };*/

  const handleSearchChangeInternal = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  /*const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.descreption?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  
    const matchesCategory = selectedCategoryId ? product.categoryId === selectedCategoryId : true;
  
    return matchesSearch && matchesCategory;
  });*/

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId
      ? product.categoryId === selectedCategoryId
      : true;

    return matchesSearch && matchesCategory;
  });

  const [productExistsInCategory, setProductExistsInCategory] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const resetErrorMessage = () => {
    setShowErrorMessage(false);
    setProductExistsInCategory(true);
  };

  /* const handleSearchSubmit = () => {
    const productsInSelectedCategory = filteredProducts.filter(product => product.categoryId === selectedCategoryId);
  
    const searchTermLowerCase = searchTerm ? searchTerm.toLowerCase() : '';
    const productsMatchingSearch = productsInSelectedCategory.filter(product => {
      const productNameLowerCase = product.title ? product.title.toLowerCase() : '';
      return productNameLowerCase.includes(searchTermLowerCase);
    });
  
    if (selectedCategoryId !== null) {
      if (productsMatchingSearch.length === 0) {
        setShowErrorMessage(true);
        setProductExistsInCategory(false);
        setTimeout(() => {
          setShowErrorMessage(false);
          setProductExistsInCategory(true);
        }, 3000);
      } else {
        setShowErrorMessage(false);
        setProductExistsInCategory(true);
        navigate(`/store?search=${searchTerm}&category=${selectedCategoryId}`);
      }
    } else {
      // Handle the case where no category is selected
      setShowErrorMessage(false);
      setProductExistsInCategory(true);
      navigate(`/store?search=${searchTerm}`);
    }
  };*/

  const handleSearchSubmit = () => {
    const productsInSelectedCategory = filteredProducts.filter(
      (product) => product.categoryId === selectedCategoryId
    );

    const searchTermLowerCase = searchTerm ? searchTerm.toLowerCase() : "";
    const productsMatchingSearch = productsInSelectedCategory.filter(
      (product) => {
        const productNameLowerCase = product.name
          ? product.name.toLowerCase()
          : "";
        return productNameLowerCase.includes(searchTermLowerCase);
      }
    );

    if (selectedCategoryId !== null && productsMatchingSearch.length === 0) {
      setProductExistsInCategory(false);
      setShowErrorMessage(true);
      setTimeout(resetErrorMessage, 3000);
    } else {
      navigate(
        `/store?search=${searchTerm}${
          selectedCategoryId !== null ? `&category=${selectedCategoryId}` : ""
        }`
      );
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    handleCategoryFilter(categoryId);
  };

  const handleSelectTwo = (categoryId) => {
    setSelectedCategoryIdTwo(categoryId);
    navigate(`/store?category=${categoryId}`);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificatonsNumber, setNotificationsNumber] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // const token = 'your_token_here';
        const language = "en";

        const response = await axios.get(
          "https://ecommerce-1-q7jb.onrender.com/api/v1/user/notification/all",
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Accept-Language": language,
            },
          }
        );
        setNotifications(response.data.data.notifications);
        console.log(
          "success fetch notification",
          response.data.data.notifications
        );
        setNotificationsNumber(response.data.data.notification.length());
        console.log(Number(response.data.data.notification.length()));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const fetchUserCart = async () => {
    try {
      const language = "en";

      const response = await axios.get(
        "https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/my",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Accept-Language": language,
          },
        }
      );

      const cartData = response.data.data;

      if (cartData && cartData.cart) {
        setCart(cartData.cart.cartItems || []);
        // calculateTotalPrice(cartData.cart.cartItems);
        console.log("Success fetch carts", cartData.cart.cartItems);
        console.log("n of products");
      } else {
        console.error(
          "Error fetching user cart: Unexpected response structure"
        );
      }
      console.log("success fetch carts", response.data.data.cart.cartItems);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const direction = useSelector((state) => state.translation.direction);

  return (
    <>
      <div className={`flexLanguage ${direction === "rtl" ? "rtl" : "ltr"}`}>
        <div className="languageInnav rightAlign">
          <select
            className="selectLang "
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="fr">Française</option>
            <option value="ar">لغه عربيه</option>
          </select>
        </div>
      </div>
      <Navbar collapseOnSelect expand="lg">
        <Container className="navPagesContainer no-margin">
          <div className="flexNav">
            <div className="flexNavone">
              <div className="search-dropdown-container">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleSelect(parseInt(e.target.value))}
                    className="dropdown-select"
                  >
                    <option value={null}>All</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      placeholder="Search Product"
                      value={searchTerm}
                      onChange={handleSearchChangeInternal}
                    />
                    <FaSearch
                      className="searchicon"
                      onClick={handleSearchSubmit}
                    />
                  </div>
                  <div className="autocom-box">
                    {productExistsInCategory === false && (
                      <div className="error-message">
                        This product does not exist in the selected category.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Navbar.Brand>
                <img src={logo} alt="Logo" />
              </Navbar.Brand>
              <div className="flexRightNav">
                <div className="text-line">
                  {!isLoggedIn && (
                    <div className="logindiv flexlogindiv ">
                      <div>
                        {" "}
                        <img
                          style={{ width: "15px", height: "15px" }}
                          src={loginimg}
                          alt="user"
                        />{" "}
                      </div>
                      <div>
                        {" "}
                        <Link to="/authentication">Login</Link>{" "}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-line text-linelogout">
                  {isLoggedIn && (
                    <>
                      <div className="relative overflow-hidden">
                        <IoIosNotificationsOutline
                          className="noteicon "
                          onClick={handleNotificationsClick}
                        />
                        <div className="w-[15px] h-[15px] rounded-full bg-red-500 mt-[-15px] ml-[-10px]"></div>
                      </div>
                      <div className="notification-dropdown-container">
                        {showNotifications && (
                          <div className="notification-dropdown">
                            {notifications.map((notification) => (
                              <div
                                className="notification-item"
                                key={notification.id}
                              >
                                <div>{notification.message}</div>
                                <div>{notification.time}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link to="/cart" className="cart-link">
                        <img
                          style={{
                            marginRight: "10px",
                            width: "30px",
                            height: "30px",
                          }}
                          src={cartimg}
                          alt="cart"
                        />
                      </Link>
                      <Link>
                        <div className="user-profile" onClick={toggleSidebar}>
                          <img
                            style={{ width: "40px", height: "40px" }}
                            src={logoutimg}
                            alt="user"
                          />
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Container className="navPagesContainer">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <div className="navPages">
                    <Link to="/home">{translations[language]?.home}</Link>
                    <Link to="/store">{translations[language]?.store}</Link>
                    <Link to="/blog">{translations[language]?.blog}</Link>

                    {/*<select
  value={selectedCategoryIdTwo}
  onChange={(e) => handleSelectTwo(parseInt(e.target.value))}
  className="dropdown-selectTwo"
>
  <option value={null} className="dropdown-selectTwo">{translations[language]?.categories}</option>
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
  </select>*/}

                    <Link to="/about">{translations[language]?.about}</Link>
                    <Link to="/contact">{translations[language]?.contact}</Link>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </div>
        </Container>

        <SidebarUser
          isOpen={showSidebar}
          onClose={toggleSidebar}
          handleLogout={handleLogout}
        />
      </Navbar>
    </>
  );
}

export default NavHeader;

/*import NavHeader from "../components/NavHeader";
import { useDispatch , useSelector  } from "react-redux";
import { setSearchTerm } from '../rtk/slices/Search-slice';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setLanguage , selectLanguage , selectTranslations } from '../rtk/slices/Translate-slice';
import './myorder.css';

function MyOrders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products);
    const language = useSelector(selectLanguage);
    const translations = useSelector(selectTranslations);
  
    const allProducts = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term.toLowerCase());
    };
  
   
    const handleProductClick = (productId) => {
      navigate(`/home/product/${productId}`);
    };
  

      const [currentStep, setCurrentStep] = useState(1); 
  const [showWizard, setShowWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStepContent = (stepNumber) => {
    if (currentStep >= stepNumber) {
      return (
        <>
          <span className="check-mark">&#10003;</span>
          <span className="check-bg"></span>
        </>
      );
    } else {
      return stepNumber;
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const handleDetailsClick = () => {
    setShowDetails(!showDetails);
  };

  const handleWizardClick = () => {
    setShowWizard(!showWizard);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };





    return(
        <div>
            <div className="page-container">
      
      <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
       
        handleProductClick={handleProductClick}
      />

      
      <div className="green-containerr">
        <div className='home-containerr testtt'>
        <div className="myprdersParagraph">
            <h1>My Orders</h1>
            <span>View and edit all your pending Delivered and Returned Orders here.</span>
          </div>
        <div className="myOrders">
      <div className="orderInfo">
        <div>name</div>
        <div>order placed</div>
        <div>total price</div>
        <div style={{cursor: "pointer"}} onClick={handleDetailsClick}>show details :</div>
       
      </div>
      
    </div>
    {showDetails && (
        <div className="">
          <div className="headerdetails">
        <div className="headerdetailsflex">
          <div><p>Paiement when recieving</p></div>
          <div >
          <div className="orderInfo">
            <button onClick={handleWizardClick}> {translations[language]?.track}</button>
            </div>
          </div>
          </div>
          <hr/>
          <div className="orderInfo">
        <div>image</div>
        <div>quantity</div>
        <div>unit price</div>
        <div>total price</div>
       
          </div>
          <div className="orderInfo">
        <div>image</div>
        <div>quantity</div>
        <div>unit price</div>
        <div>total price</div>
       
          </div>
        </div>
        
      </div>
    )}
    {showWizard && (
        <section className="step-wizard">
          <ul className="step-wizard-list">
  <li
    className={`step-wizard-item ${currentStep === 1 ? 'current-item' : ''}`}
    onClick={() => handleStepClick(1)}
  >
    <span className="progress-count">{getStepContent(1)}</span>
    <span className="progress-label">{translations[language]?.placed}</span>
  </li>
  <li
    className={`step-wizard-item ${currentStep === 2 ? 'current-item' : ''}`}
    onClick={() => handleStepClick(2)}
  >
    <span className="progress-count">{getStepContent(2)}</span>
    <span className="progress-label">{translations[language]?.process}</span>
  </li>
  <li
    className={`step-wizard-item ${currentStep === 3 ? 'current-item' : ''}`}
    onClick={() => handleStepClick(3)}
  >
    <span className="progress-count">{getStepContent(3)}</span>
    <span className="progress-label">{translations[language]?.shipped}</span>
  </li>
  <li
    className={`step-wizard-item ${currentStep === 4 ? 'current-item' : ''}`}
    onClick={() => handleStepClick(4)}
  >
    <span className="progress-count">{getStepContent(4)}</span>
    <span className="progress-label">{translations[language]?.deliver}</span>
  </li>
</ul>
        </section>
      )}
        </div>
        </div>
        </div>
        </div>
    );
}
export default MyOrders;*/



/*import NavHeader from "../components/NavHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../rtk/slices/Search-slice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import "./myorder.css";
import axios from "axios";
import { selectToken } from "../rtk/slices/Auth-slice";

function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const bearerToken = useSelector(selectToken);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-1-q7jb.onrender.com/api/v1/user/order/all",
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        }
      );

      console.log("the orders >>", response.data.data);
      setAllOrders(response.data.data.orders);
    } catch (error) {
      console.log("error in fetching All Orders", error);
    }
  };

  const handleDetailsClick = (index) => {
    setSelectedOrderIndex(index === selectedOrderIndex ? null : index);
    setShowDetails(index === selectedOrderIndex ? !showDetails : true);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "2-digit",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
  
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const formattedDay = `${day}${ordinalSuffix(day)}`;
  
    return formattedDate.replace(String(day), formattedDay);
  }
  

  return (
    <div>
      <div className="page-container">
        <NavHeader />

        <div className="green-containerr">
          <div className="home-containerr testtt">
            <div className="myprdersParagraph">
              <h1>My Orders</h1>
              <span>
                View and edit all your pending Delivered and Returned Orders
                here.
              </span>
            </div>
            <div className="myOrders">
              {allOrders?.map((order, index) => (
                <div className="orderInfo container" key={index}>
                  <div className="row">
                    <div className="col-sm bg-success rounded rounded-5 text-light text-center align-items-center p-3">
                      Order# <span className="ms-3 fs-5">{order.zipCode}</span>
                    </div>
                    <div className="col-sm">
                      order placed: {formatDate(order.orderDate)}
                    </div>
                    <div className="col-sm">
                      TOTAL Order : {order.totalAmount} $
                    </div>
                    <div
                      className="col-sm"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDetailsClick(index)}
                    >
                      {selectedOrderIndex === index && showDetails
                        ? "Hide details"
                        : "Show details"}
                    </div>
                  </div>

                  {selectedOrderIndex === index && showDetails && (
                    <div className="m-5 border-top border-bottom d-hidden">
                      <div className="container">
                        <div className="row">
                          <div className="col">
                            <h3 className="h-product">Product</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Quantity</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Unit Price</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Total Price</h3>
                          </div>
                        </div>
                        {order?.orderItems?.map((item, itemIndex) => (
                          <div className="row" key={itemIndex}>
                            <div className="col">
                              <img
                                src={item.pictureUrl}
                                alt=""
                                className="product-img "
                              />
                              <div className="">{item.productName}</div>
                            </div>
                            <div className="col">{item.quantity}</div>
                            <div className="col">${item.unitPrice}</div>
                            <div className="col">${item.totalPrice}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
       }
export default MyOrders;*/



/*import NavHeader from "../components/NavHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../rtk/slices/Search-slice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import "./myorder.css";
import axios from "axios";
import { selectToken } from "../rtk/slices/Auth-slice";
import email from '../images/Email icon.png';
import address from '../images/Location icon.png';
import phone from '../images/phone icon.png';
import { Link } from "react-router-dom";

function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const bearerToken = useSelector(selectToken);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-1-q7jb.onrender.com/api/v1/user/order/all",
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        }
      );

      console.log("the orders >>", response.data.data);
      setAllOrders(response.data.data.orders);
    } catch (error) {
      console.log("error in fetching All Orders", error);
    }
  };

  const handleDetailsClick = (index) => {
    setSelectedOrderIndex(index === selectedOrderIndex ? null : index);
    setShowDetails(index === selectedOrderIndex ? !showDetails : true);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "2-digit",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
  
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const formattedDay = `${day}${ordinalSuffix(day)}`;
  
    return formattedDate.replace(String(day), formattedDay);
  }
  

  return (
    <div>
      <div className="page-container">
        <NavHeader />

        <div className="green-containerr">
          <div className="home-containerr home-order testtt">
            <div className="myprdersParagraph  ">
              <h1  className="text-white d-flex">My Orders</h1>
              <span style={{color: 'black'}} className="text-white d-flex">
                View and edit all your pending Delivered and Returned Orders
                here.
              </span>
            </div>
            <div className="myOrders mx-auto my-auto">
              {allOrders?.map((order, index) => (
                <div className="orderInfo container border border-2 rounding align-items-center " key={index}>
                  <div className="row negative-padding ">
                    <div className="col-sm bg-success rounded rounded-5 text-light text-center align-items-center p-3 ">
                      Order# <span className="ms-3 fs-5 mx-auto">{order.zipCode}</span>
                    </div>
                    <div className="col-sm">
                      Order placed: {formatDate(order.orderDate)}
                    </div>
                    <div className="col-sm">
                      TOTAL Order : {order.totalAmount} $
                    </div>
                    <div
                      className="col-sm"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDetailsClick(index)}
                    >
                      {selectedOrderIndex === index && showDetails
                        ? "Hide details"
                        : "Show details"}
                    </div>
                  </div>

                  {selectedOrderIndex === index && showDetails && (
                    <div className="m-5 border-top border-bottom d-hidden negative-padding">
                      <div className="container">
                        <div className="row negative-padding">
                          <div className="col">
                            <h3 className="h-product">Product</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Quantity</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Unit Price</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Total Price</h3>
                          </div>
                        </div>
                        {order?.orderItems?.map((item, itemIndex) => (
                          <div className="row" key={itemIndex}>
                            <div className="col ">
                              
                              <img
                                src={item.pictureUrl}
                                alt=""
                                className="product-img "
                              />
                              <div className="">{item.productName}</div>
                            </div>
                            <div className="col">{item.quantity}</div>
                            <div className="col">${item.unitPrice}</div>
                            <div className="col">${item.totalPrice}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='footerr footerPhr'>
          <div className=' header-container '>
            <div className='flexFooter'>
                <div className='cartfooter'>
                    <div className='important'>
                        <h1>important links</h1>
                        <Link className='footerlink'>privacy policy </Link>
                        <Link className='footerlink'>cookies policy </Link>
                        <Link className='footerlink'>Terms & conditions </Link>
                    </div>
                    <div className='information'>
                        <h1>Informations sur la livraison</h1>
                        <h2>Informations d'expédition Pour garantir que vos achats arrivent sans problème, assurez-vous de fournir l'adresse et le numéro de téléphone corrects pour garantir une 
                        expérience d'achat pratique et efficace. Assurez-vous que vos informations d'expédition sont à jour, y compris les détails de l'adresse et le délai de livraison souhaité, pour 
                        vous assurer de recevoir votre commande rapidement et sans retards inutiles.
                        </h2>
                    </div>
                </div>
                <div className='cartfooter cartfootertwo'>
                <div className='important'>
                        <h1>coordonnées</h1>
                        <h2>Contactez-nous pour toute demande de renseignements ou d'assistance dont vous avez besoin, nous sommes là pour vous fournir soutien et conseils
                        </h2>
                    </div>
                    <div className='address'>
                        <div className='flexaddress'>
                        <img  src={address}/>
                        <h2>l'adresse:</h2>
                        </div>
                        <h2>LAAYOUNE : MADINAT EL WAHDA BLOC B NR 91 LAAYOUNE (M) <br />
                        Tetouan: Mezanine bloc B Bureau n 4 BOROUJ 16 Avenue des Far N° 873 Tétouan
                        </h2>
                    </div>
                    <div className='flexphoneemail'>
                    <div className='address'>
                        <div className='flexaddress'>
                        <img  src={phone}/>
                        <h2>Phone:</h2>
                        </div>
                        <h2>00212689831227</h2>
                    </div>
                    <div className='address'>
                        <div className='flexaddress'>
                        <img  src={email}/>
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
  );
}
export default MyOrders;*/


import NavHeader from "../components/NavHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../rtk/slices/Search-slice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import "./myorder.css";
import axios from "axios";
import { selectToken } from "../rtk/slices/Auth-slice";
import { AiTwotoneDelete } from "react-icons/ai";

function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const bearerToken = useSelector(selectToken);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-1-q7jb.onrender.com/api/v1/user/order/all",
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        }
      );

      console.log("the orders >>", response.data.data);
      setAllOrders(response.data.data.orders);
    } catch (error) {
      console.log("error in fetching All Orders", error);
    }
  };

  const handleDetailsClick = (index) => {
    setSelectedOrderIndex(index === selectedOrderIndex ? null : index);
    setShowDetails(index === selectedOrderIndex ? !showDetails : true);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "2-digit",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
  
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const formattedDay = `${day}${ordinalSuffix(day)}`;
  
    return formattedDate.replace(String(day), formattedDay);
  }


  return (
    <div>
      <div className="page-container">
        <NavHeader />

        <div className="green-containerr">
          <div className="home-containerr home-order testtt">
            <div className="myprdersParagraph  ">
              <h1 className="text-white d-flex">My Orders</h1>
              <span className="text-white d-flex">
                View and edit all your pending Delivered and Returned Orders
                here.
              </span>
            </div>
            <div className="myOrders mx-auto my-auto">
              {allOrders?.map((order, index) => (
                <div
                  className="orderInfo container border border-2 rounding align-items-center "
                  key={index}
                >
                  <div className="row negative-padding gap-1">
                    <div className="col bg-success rounded rounded-5 text-light text-center align-items-center p-3 ">
                      Order#{" "}
                      <span className="ms-3 fs-5 mx-auto col">
                        {order.zipCode}
                      </span>
                    </div>
                    <div className="col my-auto ">
                      Order placed: <span>{formatDate(order.orderDate)}</span>
                    </div>
                    <div className="col my-auto">
                      TOTAL Order : {order.totalAmount} $
                    </div>
                    <div className="col my-auto">
                      Order Status: <span>{order.orderStatus}</span>
                    </div>
                    <div
                      className="col  my-auto mr-auto"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDetailsClick(index)}
                    >
                      {selectedOrderIndex === index && showDetails
                        ? "Hide details"
                        : "Show details"}
                    </div>
                  </div>

                  {selectedOrderIndex === index && showDetails && (
                    <div className="m-5 border-top border-bottom d-hidden negative-padding">
                      <div className="container">
                        <div className="row negative-padding">
                          <div className="col">
                            <h3 className="h-product">Product</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Quantity</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Unit Price</h3>
                          </div>
                          <div className="col">
                            <h3 className="h-product">Total Price</h3>
                          </div>

                        </div>
                        {order?.orderItems?.map((item, itemIndex) => (
                          <div className="row" key={itemIndex}>
                            <div className="col ">
                              <img
                                src={item.pictureUrl}
                                alt=""
                                className="product-img "
                              />
                              <div className="">{item.productName}</div>
                            </div>
                            <div className="col">{item.quantity}</div>
                            <div className="col">${item.unitPrice}</div>
                            <div className="col">${item.totalPrice}</div>
                            <div className="col">${item.totalPrice}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyOrders;
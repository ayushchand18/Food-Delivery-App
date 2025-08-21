import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const navigate= useNavigate();

  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    floor: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [department, setDepartment] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const [bulkNote, setBulkNote] = useState("");
  const [bulkOrderBy, setBulkOrderBy] = useState("individual");
  const [companyDeliveryAddress, setCompanyDeliveryAddress] = useState("");
  const [companyFloor, setCompanyFloor] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyPincode, setCompanyPincode] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const getTotalQuantity = () => {
    let totalQty = 0;
    for (const id in cartItems) {
      if (cartItems[id] > 0) totalQty += cartItems[id];
    }
    return totalQty;
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    const totalQuantity = getTotalQuantity();
    const isBulk = totalQuantity > 15;
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      orderType: isBulk ? "bulk" : "individual",
      bulkOrderBy: isBulk ? bulkOrderBy : undefined,
      companyName: isBulk ? companyName : undefined,
      department: isBulk ? department : undefined,
      companyDeliveryAddress: isBulk && bulkOrderBy === 'company' ? companyDeliveryAddress : undefined,
      companyFloor: isBulk && bulkOrderBy === 'company' ? companyFloor : undefined,
      companyCity: isBulk && bulkOrderBy === 'company' ? companyCity : undefined,
      companyState: isBulk && bulkOrderBy === 'company' ? companyState : undefined,
      companyPincode: isBulk && bulkOrderBy === 'company' ? companyPincode : undefined,
      companyCountry: isBulk && bulkOrderBy === 'company' ? companyCountry : undefined,
      companyEmail: isBulk && bulkOrderBy === 'company' ? companyEmail : undefined,
      companyPhone: isBulk && bulkOrderBy === 'company' ? companyPhone : undefined,
      deliveryTime: isBulk && deliveryTime ? new Date(deliveryTime) : undefined,
      paymentMode: isBulk && bulkOrderBy === 'company' ? 'invoice' : paymentMode,
      bulkNote: isBulk ? bulkNote : undefined,
      contactName: isBulk ? contactName : undefined,
      contactPhone: isBulk ? contactPhone : undefined,
    };
    
    let response= await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if(response.data.success){
      const {session_url}=response.data;
      if(session_url){
        window.location.replace(session_url);
      }else{
        toast.success("Order placed with Cash on Delivery/Invoice");
        navigate("/myorders");
      }
    }else{
      toast.error("Errors!")
    }
  };

  useEffect(()=>{
    if(!token){
      toast.error("Please Login first")
      navigate("/cart")
    }
    else if(getTotalCartAmount()===0){
      toast.error("Please Add Items to Cart");
      navigate("/cart")
    }
  },[token])
  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        {(() => { const isBulkOrder = getTotalQuantity() > 15; return isBulkOrder ? (
          <>
            <div className="field">
              <label>Ordered by</label>
              <select className="modern-select" value={bulkOrderBy} onChange={(e)=>setBulkOrderBy(e.target.value)}>
                <option value="company">Company</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            {/* Unified layout: same fields, labels change by selection */}
            <div className="order-settings">
              <div className="two-col">
                <div className="field">
                  <label>{bulkOrderBy === 'company' ? 'Company Name' : 'Name'}</label>
                  <input className="modern-input" type="text" placeholder={bulkOrderBy === 'company' ? 'Company Name' : 'Your Name'} value={bulkOrderBy === 'company' ? companyName : data.firstName} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyName(e.target.value) : setData({...data, firstName:e.target.value}) } required />
                </div>
                <div className="field">
                  <label>{bulkOrderBy === 'company' ? 'Company Email Address' : 'Email Address'}</label>
                  <input className="modern-input" type="email" placeholder={bulkOrderBy === 'company' ? 'Company Email' : 'Email'} value={bulkOrderBy === 'company' ? companyEmail : data.email} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyEmail(e.target.value) : setData({...data, email:e.target.value}) } required />
                </div>
              </div>
              <div className="field">
                <label>{bulkOrderBy === 'company' ? 'Company Address' : 'Address'}</label>
                <input className="modern-input" type="text" placeholder={bulkOrderBy === 'company' ? 'Company Address' : 'Address'} value={bulkOrderBy === 'company' ? companyDeliveryAddress : data.street} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyDeliveryAddress(e.target.value) : setData({...data, street:e.target.value}) } required />
              </div>
              <div className="two-col">
                <div className="field">
                  <label>{bulkOrderBy === 'company' ? 'Company Floor' : 'Floor No.'}</label>
                  <input className="modern-input" type="text" placeholder={bulkOrderBy === 'company' ? 'Company Floor' : 'Floor No.'} value={bulkOrderBy === 'company' ? companyFloor : data.floor} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyFloor(e.target.value) : setData({...data, floor:e.target.value}) } />
                </div>
                <div className="field">
                  <label>City</label>
                  <input className="modern-input" type="text" placeholder="City" value={bulkOrderBy === 'company' ? companyCity : data.city} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyCity(e.target.value) : setData({...data, city:e.target.value}) } required />
                </div>
              </div>
              <div className="two-col">
                <div className="field">
                  <label>State</label>
                  <input className="modern-input" type="text" placeholder="State" value={bulkOrderBy === 'company' ? companyState : data.state} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyState(e.target.value) : setData({...data, state:e.target.value}) } required />
                </div>
                <div className="field">
                  <label>Pincode</label>
                  <input className="modern-input" type="text" placeholder="Pincode" value={bulkOrderBy === 'company' ? companyPincode : data.zipcode} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyPincode(e.target.value) : setData({...data, zipcode:e.target.value}) } required />
                </div>
              </div>
              <div className="field">
                <label>Country</label>
                <input className="modern-input" type="text" placeholder="Country" value={bulkOrderBy === 'company' ? companyCountry : data.country} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyCountry(e.target.value) : setData({...data, country:e.target.value}) } required />
              </div>
              <div className="two-col">
                <div className="field">
                  <label>Phone Number</label>
                  <input className="modern-input" type="text" placeholder="Phone" value={bulkOrderBy === 'company' ? companyPhone : data.phone} onChange={(e)=> bulkOrderBy === 'company' ? setCompanyPhone(e.target.value) : setData({...data, phone:e.target.value}) } required />
                </div>
                <div className="field">
                  <label>Order Time</label>
                  <input className="modern-input" type="datetime-local" value={deliveryTime} onChange={(e)=>setDeliveryTime(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Payment Mode</label>
                <select className="modern-select" value={paymentMode} onChange={(e)=>setPaymentMode(e.target.value)}>
                  <option value="online">Online</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="invoice">Invoice (Monthly)</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="multi-fields">
              <input required name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First name" />
              <input required name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last name" />
            </div>
            <input required name="email" value={data.email} onChange={onChangeHandler} type="text" placeholder="Email Address" />
            <input required name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" />
            <div className="multi-fields">
              <input required name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="City" />
              <input required name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" />
            </div>
            <div className="multi-fields">
              <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} type="text" placeholder="Zip Code" />
              <input required name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" />
            </div>
            <input required name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder="Phone" />
          </>
        ); })()}
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          
          <div>
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

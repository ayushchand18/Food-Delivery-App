import React, { useContext, useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [category,setCategory]=useState("All");
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const startGroupOrder = async ()=>{
    if(!token){
      toast.error('Please login to start a group order');
      return;
    }
    const res = await axios.post(url+'/api/group/create', {}, { headers: { token } });
    if(res.data.success){
      const groupId = res.data.data.groupId;
      const link = window.location.origin+`/group/${groupId}`;
      await navigator.clipboard.writeText(link).catch(()=>{});
      toast.success('Group link copied to clipboard');
      navigate(`/group/${groupId}`);
    }else{
      toast.error('Could not create group order');
    }
  }
  return (
    <div>
      <Header/>
      <div style={{display:'flex', justifyContent:'center', marginTop:16}}>
        <button onClick={startGroupOrder} style={{background:'linear-gradient(90deg, tomato, #ff8a65)', color:'#fff', border:'none', padding:'12px 16px', borderRadius:8, cursor:'pointer'}}>Start Group Order</button>
      </div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category}/>
      <AppDownload/>
    </div>
  )
}

export default Home

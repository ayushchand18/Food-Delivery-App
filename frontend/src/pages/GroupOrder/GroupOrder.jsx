import React, { useContext, useEffect, useMemo, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const GroupOrder = () => {
  const { url, token, food_list } = useContext(StoreContext);
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  const fetchGroup = async () => {
    const res = await axios.get(`${url}/api/group/${groupId}`);
    if (res.data.success) setGroup(res.data.data);
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const onAdd = async (itemId) => {
    if (!token) return toast.error("Login required");
    const res = await axios.post(
      `${url}/api/group/${groupId}/add`,
      { itemId, quantity: 1 },
      { headers: { token } }
    );
    if (res.data.success) {
      toast.success("Added to group");
      setGroup(res.data.data);
    } else toast.error(res.data.message || "Error");
  };

  const isCreator = useMemo(() => {
    return group && group.creatorUserId && token; // server re-checks auth on import/close
  }, [group, token]);

  const onImport = async () => {
    const res = await axios.post(
      `${url}/api/group/${groupId}/import`,
      {},
      { headers: { token } }
    );
    if (res.data.success) toast.success("Imported group items to your cart");
    else toast.error(res.data.message || "Error");
  };
  const onCopy = async ()=>{
    const link = window.location.origin+`/group/${groupId}`;
    try{
      await navigator.clipboard.writeText(link);
      toast.success('Link copied');
    }catch{
      toast.error('Copy failed');
    }
  }
  const onClose = async ()=>{
    const res = await axios.post(
      `${url}/api/group/${groupId}/close`,
      {},
      { headers: { token } }
    );
    if(res.data.success){ setGroup(res.data.data); toast.success('Group closed'); }
    else toast.error(res.data.message || 'Error');
  }

  if (!group) return <div className="container" style={{marginTop:100}}>Loading...</div>;

  return (
    <div className="container" style={{marginTop:100}}>
      <h2>Group Order: {group.groupId}</h2>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <p>Status: {group.status}</p>
        <button onClick={onCopy} style={{marginLeft:8, background:'#f2f2f2', border:'1px solid #e5e5e5', padding:'6px 10px', borderRadius:6, cursor:'pointer'}}>Copy Share Link</button>
        {isCreator && group.status==='open' && (
          <button onClick={onClose} style={{background:'#222', color:'#fff', border:'none', padding:'6px 10px', borderRadius:6, cursor:'pointer'}}>Close Group</button>
        )}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16, marginTop:16}}>
        {food_list.map(item => (
          <div key={item._id} style={{border:'1px solid #eee', borderRadius:8, padding:12, background:'#fff', height: 320, display:'flex', flexDirection:'column'}}>
            <img src={`${url}/images/${item.image}`} alt={item.name} style={{width:'100%', height: 160, objectFit:'cover', borderRadius:6, marginBottom:8}}/>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto'}}>
              <div>
                <div style={{fontWeight:600}}>{item.name}</div>
                <div style={{color:'#666'}}>${item.price}</div>
              </div>
              <button onClick={()=>onAdd(item._id)} style={{background:'tomato', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer'}}>Add</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:24}}>
        <h3>Current Items</h3>
        {group.items.length === 0 && <p>No items yet. Share this link to collect items.</p>}
        {group.items.map((it, idx) => (
          <div key={idx} style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee', padding:'8px 0'}}>
            <span>{it.name} x {it.quantity}</span>
            <span>${it.price * it.quantity}</span>
          </div>
        ))}
      </div>
      {isCreator && (
        <div style={{marginTop:16, display:'flex', gap:12}}>
          <button onClick={onImport} style={{background:'black', color:'#fff', border:'none', padding:'10px 14px', borderRadius:6, cursor:'pointer'}}>Import To My Cart</button>
        </div>
      )}
    </div>
  );
};

export default GroupOrder;



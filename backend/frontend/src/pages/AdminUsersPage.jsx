import { useEffect, useState } from "react";
import api from "../api";
import UserList from "../components/UserList";

export default function AdminUsersPage(){
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const load = async()=> {
    try{
      const {data} = await api.get("/api/users");
      setItems(data.items || []);
      setErr("");
    }catch(e){ setErr(e?.response?.data?.message || e.message); }
  };

  const removeUser = async(id)=>{
    if(!window.confirm("Xoá user này?")) return;
    try{
      await api.delete(`/api/users/${id}`);
      setItems(items.filter(u=>u._id!==id));
    }catch(e){ alert(e?.response?.data?.message || e.message); }
  };

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{padding:16}}>
      <h2>Admin – Users</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      <UserList items={items} onRemove={removeUser}/>
    </div>
  );
}

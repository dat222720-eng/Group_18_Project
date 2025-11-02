import { useEffect, useState } from "react";
import { Users } from "../api";
import AddUser from "./AddUser";

export default function UserList(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");

  const load = () => {
    setLoading(true); setErr("");
    Users.list()
      .then(res => setItems(res.data))
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div style={{padding:16}}>
      <h2>Users</h2>
      <AddUser onAdded={load}/>
      {loading? <p>Loading...</p> :
       err? <p style={{color:"red"}}>{err}</p> :
       <ul>{items.map(u => <li key={u._id||u.id}>{u.name} — {u.email}</li>)}</ul>}
    </div>
  );
}

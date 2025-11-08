import { useState } from "react";
import api from "../api";

export default function Signup() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");

  const submit = async e => {
    e.preventDefault(); setErr(""); setMsg("");
    try{
      await api.post("/api/auth/signup", {name,email,password});
      setMsg("Đăng ký thành công, hãy đăng nhập");
    }catch(e){ setErr(e?.response?.data?.message || e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h1>Sign up</h1>
      {err && <p style={{color:"red"}}>{err}</p>}
      {msg && <p style={{color:"green"}}>{msg}</p>}
      <form onSubmit={submit}>
        <input placeholder="Tên" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Sign up</button>
      </form>
      <p><a href="/Login">Đăng nhập</a></p>
    </div>
    
  );
}

import { useState } from "react";
import api from "../api";

export default function Reset(){
  const [token,setToken] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");

  const submit = async e=>{
    e.preventDefault(); setErr(""); setMsg("");
    try{
      const {data} = await api.post("/api/reset-password", { token, password });
      setMsg(data.message || "Đổi mật khẩu thành công");
    }catch(e){ setErr(e?.response?.data?.message || e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Reset Password</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      {msg && <p style={{color:"green"}}>{msg}</p>}
      <form onSubmit={submit}>
        <input placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
        <input placeholder="Mật khẩu mới" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Đổi mật khẩu</button>
      </form>
    </div>
  );
}

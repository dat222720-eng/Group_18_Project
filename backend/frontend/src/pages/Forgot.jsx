import { useState } from "react";
import api from "../api";

export default function Forgot(){
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");

  const submit = async e=>{
    e.preventDefault(); setErr(""); setMsg("");
    try{
      const {data} = await api.post("/api/forgot-password", { email });
      setMsg(data.message || "Đã gửi token nếu email tồn tại");
    }catch(e){ setErr(e?.response?.data?.message || e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Forgot Password</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      {msg && <p style={{color:"green"}}>{msg}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button>Gửi</button>
      </form>
      <p>Kiểm tra Console BE để lấy token demo.</p>
      <p><a href="/reset">Đổi mật khẩu bằng token</a></p>
    </div>
  );
}

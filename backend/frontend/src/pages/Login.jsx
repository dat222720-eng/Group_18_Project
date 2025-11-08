import { useState } from "react";
import api from "../api";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const submit = async e => {
    e.preventDefault(); setErr("");
    try{
      const {data} = await api.post("/api/auth/login", {email,password});
      localStorage.setItem("token", data.token);
      location.href = "/profile";
    }catch(e){ setErr(e?.response?.data?.message || e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h1>Đăng nhập</h1>
      {err && <p style={{color:"red"}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      <p><a href="/forgot">Quên mật khẩu?</a></p>
      <p><a href="/signup">Đăng ký</a></p>
    </div>
  );
}

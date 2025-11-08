import { useEffect, useState } from "react";
import api from "../api";

function AvatarUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const send = async () => {
    if (!file) return setMsg("Chưa chọn file");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/api/upload-avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Tải ảnh thành công");
      onUploaded?.(data.avatarUrl, data.user); // báo cho trang cha để hiển thị ngay
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Upload Avatar</h3>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <button type="button" onClick={send}>Upload</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/api/profile");
      setEmail(data.email || "");
      setName(data.name || "");
      setAvatarUrl(data.avatarUrl || "");
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  const update = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.put("/api/profile", { name });
      setMsg("Cập nhật thành công");
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Thông tin cá nhân</h1>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {/* Hiển thị avatar đã lưu trong DB */}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="avatar"
          width={120}
          style={{ display: "block", margin: "8px 0" }}
        />
      )}

      <form onSubmit={update} style={{ marginBottom: 12 }}>
        <input value={email} readOnly placeholder="Email" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên"
        />
        <button>Cập nhật</button>
      </form>

      {/* Upload xong cập nhật avatarUrl ngay */}
      <AvatarUpload onUploaded={(url) => setAvatarUrl(url)} />

      <p style={{ marginTop: 16 }}>
        <a href="/admin/users">Trang Admin</a>
      </p>
    </div>
  );
}

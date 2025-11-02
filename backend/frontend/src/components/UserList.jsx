import { useEffect, useState } from "react";
import { Users } from "../api";

export default function UserList() {
  // data & meta
  const [items, setItems] = useState([]);
  const [meta, setMeta]   = useState({ page:1, totalPages:1, total:0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filter/sort/page
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({ name:"", email:"" });

  const load = (p = page) => {
    setLoading(true); setErr("");
    Users.list({ q, sort, order, limit, page: p })
      .then(({ data }) => {
        setItems(data.items || data);           // hỗ trợ cả 2 kiểu trả về
        setMeta(data.page ? data : { page:p, totalPages:1, total:(data.items?.length ?? data.length) });
        setPage(data.page || p);
      })
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [q, sort, order, limit]);

  // edit/delete
  const startEdit = (u) => { setEditingId(u._id); setEditForm({ name:u.name??"", email:u.email??"" }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({name:"",email:""}); };
  const saveEdit = async () => {
    try { await Users.update(editingId, editForm); cancelEdit(); load(); }
    catch(e){ alert(e?.response?.data?.message || e.message); }
  };
  const handleDelete = async (id) => {
    if(!window.confirm("Xóa user này?")) return;
    try { await Users.remove(id); setItems(items.filter(x=>x._id!==id)); }
    catch(e){ alert(e?.response?.data?.message || e.message); }
  };

  return (
    <>
      {/* Bộ lọc */}
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <input placeholder="Tìm tên/email…" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="createdAt">Mới nhất</option>
          <option value="name">Tên</option>
          <option value="email">Email</option>
        </select>
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>
        <select value={limit} onChange={e=>setLimit(+e.target.value)}>
          <option value={2}>2</option><option value={5}>5</option><option value={10}>10</option>
        </select>
        <button onClick={()=>load(1)}>Lọc</button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{color:"red"}}>{err}</p>}

      <ul>
        {items.map(u => (
          <li key={u._id} style={{marginBottom:8}}>
            {editingId === u._id ? (
              <>
                <input value={editForm.name}  onChange={e=>setEditForm({...editForm, name:e.target.value})} placeholder="Name" />
                <input value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})} placeholder="Email" style={{marginLeft:6}} />
                <button onClick={saveEdit} style={{marginLeft:6}}>Lưu</button>
                <button onClick={cancelEdit} style={{marginLeft:6}}>Hủy</button>
              </>
            ) : (
              <>
                {u.name} — {u.email}
                <button onClick={()=>startEdit(u)} style={{marginLeft:6}}>Sửa</button>
                <button onClick={()=>handleDelete(u._id)} style={{marginLeft:6}}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Phân trang */}
      <div style={{display:"flex", gap:8, alignItems:"center", marginTop:8}}>
        <button disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
        <span>{page}/{meta.totalPages} • {meta.total} items</span>
        <button disabled={page>=meta.totalPages} onClick={()=>load(page+1)}>Next</button>
      </div>
    </>
  );
}

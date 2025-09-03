import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchTrips, createTrip, updateTrip, deleteTrip, Trip } from "./trips.slice";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" });

export default function App(){
  const d = useAppDispatch();
  const {items,loading,error} = useAppSelector(s=>s.trips);
  const [form,setForm] = useState<Trip>({ name:"", country:"", start_date:"", end_date:"", notes:"" });
  const [countries,setCountries] = useState<{name:string,cca2:string,flag:string}[]>([]);
  const [q,setQ] = useState("");

  useEffect(()=>{ d(fetchTrips()); }, [d]);
  useEffect(()=>{
    const f = async ()=>{ const {data}= await api.get("/countries",{params:{q}}); setCountries(data.slice(0,10)); };
    f();
  },[q]);

  const submit = async (e:any)=>{ e.preventDefault();
    if(form.id) await d(updateTrip(form as any));
    else await d(createTrip(form));
    setForm({ name:"", country:"", start_date:"", end_date:"", notes:"" });
  };

  return (
    <div style={{maxWidth:900, margin:"2rem auto", fontFamily:"system-ui"}}>
      <h1>WTI Trips</h1>
      <form onSubmit={submit} style={{display:"grid", gap:8}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})}/>
        <input placeholder="Search country..." value={q} onChange={e=>setQ(e.target.value)}/>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          {countries.map(c=>
            <button key={c.cca2} type="button" onClick={()=>setForm({...form,country:c.name})}>
              {c.flag} {c.name}
            </button>
          )}
        </div>
        <input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})}/>
        <input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})}/>
        <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
        <button type="submit">{form.id ? "Update" : "Create"}</button>
        {error && <p style={{color:"crimson"}}>{error}</p>}
      </form>

      <h2 style={{marginTop:24}}>Trips</h2>
      {loading && <p>Loading…</p>}
      <table width="100%" cellPadding={6} style={{borderCollapse:"collapse"}}>
        <thead><tr><th>ID</th><th>Name</th><th>Country</th><th>Start</th><th>End</th><th/></tr></thead>
        <tbody>
          {items.map(t=>
            <tr key={t.id} style={{borderTop:"1px solid #ccc"}}>
              <td>{t.id}</td><td>{t.name}</td><td>{t.country}</td><td>{t.start_date}</td><td>{t.end_date}</td>
              <td style={{display:"flex",gap:8}}>
                <button onClick={()=>setForm(t)}>Edit</button>
                <button onClick={()=>d(deleteTrip(t.id!))}>Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Trip = {
  id?: number; name: string; country: string; start_date: string; end_date: string; notes: string;
};

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" });

export const fetchTrips = createAsyncThunk("trips/fetch", async () => (await api.get("/trips")).data);
export const createTrip = createAsyncThunk("trips/create", async (t: Trip) => (await api.post("/trips", t)).data);
export const updateTrip = createAsyncThunk("trips/update", async ({id, ...t}: Trip & {id:number}) => (await api.put(`/trips/${id}`, t)).data);
export const deleteTrip = createAsyncThunk("trips/delete", async (id: number) => { await api.delete(`/trips/${id}`); return id; });

type State = { items: Trip[]; loading: boolean; error?: string | null; };
const initialState: State = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "trips", initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTrips.pending, (s)=>{s.loading=true; s.error=null;});
    b.addCase(fetchTrips.fulfilled, (s,a:PayloadAction<Trip[]>)=>{s.loading=false; s.items=a.payload;});
    b.addCase(fetchTrips.rejected, (s,a)=>{s.loading=false; s.error=String(a.error.message || "error");});
    [createTrip.fulfilled, updateTrip.fulfilled].forEach(ac => b.addCase(ac,(s,a:PayloadAction<Trip>)=>{
      const i = s.items.findIndex(x=>x.id===a.payload.id);
      if(i>=0) s.items[i]=a.payload; else s.items.unshift(a.payload);
    }));
    b.addCase(deleteTrip.fulfilled, (s,a:PayloadAction<number>)=>{ s.items = s.items.filter(x=>x.id!==a.payload); });
  }
});
export default slice.reducer;

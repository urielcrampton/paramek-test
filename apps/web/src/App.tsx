import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchTrips, createTrip, updateTrip, deleteTrip } from "./trips.slice";
import type { Trip } from "./trips.slice";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" });

export default function App(){
  console.log("App component rendering...");
  
  const dispatch = useAppDispatch();
  const {items, loading, error} = useAppSelector(state => state.trips);
  const [form, setForm] = useState<Trip>({ 
    name: "", 
    country: "", 
    start_date: "", 
    end_date: "", 
    notes: "" 
  });
  const [countries, setCountries] = useState<{name: string, cca2: string, flag: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Cargar viajes al montar el componente
  useEffect(() => {
    console.log("Fetching trips...");
    dispatch(fetchTrips());
  }, [dispatch]);

  // Buscar países cuando cambie la consulta
  useEffect(() => {
    if (searchQuery.length > 0) {
      const searchCountries = async () => {
        try {
          const { data } = await api.get("/countries", { params: { q: searchQuery } });
          setCountries(data.slice(0, 10));
        } catch (err) {
          console.error("Error fetching countries:", err);
        }
      };
      searchCountries();
    } else {
      setCountries([]);
    }
  }, [searchQuery]);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    
    try {
      if (isEditing && form.id) {
        await dispatch(updateTrip(form as Trip & {id: number}));
      } else {
        await dispatch(createTrip(form));
      }
      
      // Limpiar formulario
      setForm({ name: "", country: "", start_date: "", end_date: "", notes: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // Manejar edición
  const handleEdit = (trip: Trip) => {
    setForm(trip);
    setIsEditing(true);
  };

  // Manejar cancelar edición
  const handleCancel = () => {
    setForm({ name: "", country: "", start_date: "", end_date: "", notes: "" });
    setIsEditing(false);
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este viaje?")) {
      try {
        await dispatch(deleteTrip(id));
      } catch (err) {
        console.error("Error deleting trip:", err);
      }
    }
  };

  return (
    <div style={{
      maxWidth: "1200px", 
      margin: "0 auto", 
      fontFamily: "system-ui, -apple-system, sans-serif", 
      padding: "20px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2c3e50", fontSize: "2.5rem", margin: "0 0 10px 0" }}>
          🌍 WTI Trips Manager
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "1.1rem", margin: "0" }}>
          Gestiona tus viajes de forma fácil y rápida
        </p>
      </header>

      {/* Formulario */}
      <div style={{
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#2c3e50", marginTop: "0", marginBottom: "20px" }}>
          {isEditing ? "✏️ Editar Viaje" : "➕ Crear Nuevo Viaje"}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#2c3e50" }}>
                Nombre del Viaje *
              </label>
              <input
                type="text"
                placeholder="Ej: Vacaciones en París"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e1e8ed",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#2c3e50" }}>
                País *
              </label>
              <input
                type="text"
                placeholder="Ej: Francia"
                value={form.country}
                onChange={(e) => setForm({...form, country: e.target.value})}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e1e8ed",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>

          {/* Búsqueda de países */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#2c3e50" }}>
              Buscar País
            </label>
            <input
              type="text"
              placeholder="Escribe para buscar países..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e1e8ed",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            />
            
            {/* Lista de países */}
            {countries.length > 0 && (
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px"
              }}>
                {countries.map(country => (
                  <button
                    key={country.cca2}
                    type="button"
                    onClick={() => {
                      setForm({...form, country: country.name});
                      setSearchQuery("");
                    }}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2980b9"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3498db"}
                  >
                    {country.flag} {country.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#2c3e50" }}>
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({...form, start_date: e.target.value})}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e1e8ed",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#2c3e50" }}>
                Fecha de Fin *
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({...form, end_date: e.target.value})}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e1e8ed",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#2c3e50" }}>
              Notas
            </label>
            <textarea
              placeholder="Información adicional sobre tu viaje..."
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e1e8ed",
                borderRadius: "8px",
                fontSize: "16px",
                resize: "vertical"
              }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#95a5a6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500"
                }}
              >
                Cancelar
              </button>
            )}
            
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: isEditing ? "#f39c12" : "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "background-color 0.3s"
              }}
            >
              {isEditing ? "💾 Actualizar Viaje" : "➕ Crear Viaje"}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: "#e74c3c",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              ❌ Error: {error}
            </div>
          )}
        </form>
      </div>

      {/* Lista de viajes */}
      <div style={{
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ color: "#2c3e50", marginTop: "0", marginBottom: "20px" }}>
          📋 Mis Viajes ({items.length})
        </h2>
        
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
            Cargando viajes...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>✈️</div>
            <h3>No tienes viajes registrados</h3>
            <p>¡Crea tu primer viaje usando el formulario de arriba!</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #e1e8ed"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e1e8ed" }}>ID</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e1e8ed" }}>Nombre</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e1e8ed" }}>País</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e1e8ed" }}>Inicio</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e1e8ed" }}>Fin</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "2px solid #e1e8ed" }}>Notas</th>
                  <th style={{ padding: "15px", textAlign: "center", borderBottom: "2px solid #e1e8ed" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((trip) => (
                  <tr key={trip.id} style={{ borderBottom: "1px solid #e1e8ed" }}>
                    <td style={{ padding: "15px" }}>#{trip.id}</td>
                    <td style={{ padding: "15px", fontWeight: "500" }}>{trip.name}</td>
                    <td style={{ padding: "15px" }}>🌍 {trip.country}</td>
                    <td style={{ padding: "15px" }}>{trip.start_date}</td>
                    <td style={{ padding: "15px" }}>{trip.end_date}</td>
                    <td style={{ padding: "15px", maxWidth: "200px", wordWrap: "break-word" }}>
                      {trip.notes || <em style={{ color: "#7f8c8d" }}>Sin notas</em>}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={() => handleEdit(trip)}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f39c12",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(trip.id!)}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
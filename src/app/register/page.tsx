"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, User, Shield, ArrowLeft, Loader2, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";

interface CompaniaPublic {
  id: string;
  nombre: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    ciudad: "",
    rol: "USUARIO",
    compania_id: "",
  });

  const [companias, setCompanias] = useState<CompaniaPublic[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCompanias, setFetchingCompanias] = useState(true);

  useEffect(() => {
    const fetchCompanias = async () => {
      try {
        const resp = await api.get("/companias/public");
        setCompanias(resp.data);
      } catch (err) {
        console.error("Error fetching public companies:", err);
      } finally {
        setFetchingCompanias(false);
      }
    };
    fetchCompanias();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.rol === "USUARIO" && !formData.compania_id) {
        setError("Por favor selecciona una compañía.");
        setLoading(false);
        return;
      }

      // El backend espera 'roles' como lista
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        ciudad: formData.ciudad,
        roles: [formData.rol],
        compania_id: formData.compania_id || null,
      };

      const resp = await api.post("/auth/registro", payload);

      if (resp.status === 201) {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.mensaje || "Error al registrarse. Intenta de nuevo.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[20%] w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-2xl w-full relative h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8 my-4 transition-transform duration-300">
          
          <Link href="/login" className="inline-flex items-center text-indigo-300 hover:text-white transition-colors text-sm mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al login
          </Link>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4 transform rotate-6">
              <User className="w-8 h-8 text-white -rotate-6" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Crea tu cuenta</h2>
            <p className="text-indigo-200 mt-2 text-sm">Completa todos los campos para unirte</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Nombre</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Apellido</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                    placeholder="jperez"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-indigo-100 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Teléfono</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50"
                    placeholder="+57 300 000 0000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Ciudad</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="ciudad"
                    type="text"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50"
                    placeholder="Medellín"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Rol</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none"
                  >
                    <option value="USUARIO" className="bg-slate-900">USUARIO</option>
                    <option value="ADMIN" className="bg-slate-900">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-indigo-100 ml-1">Compañía</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <select
                    name="compania_id"
                    value={formData.compania_id}
                    onChange={handleChange}
                    disabled={fetchingCompanias}
                    className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all appearance-none disabled:opacity-50"
                  >
                    <option value="" className="bg-slate-900">Seleccionar...</option>
                    {companias.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900">
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 shadow-lg shadow-purple-500/30 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Creando cuenta...
                </>
              ) : (
                "Registrarse ahora"
              )}
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

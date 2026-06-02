"use client";

import { useState, useEffect } from "react";
import { Empleado, createEmpleado, updateEmpleado } from "@/services/employees";
import { Compania, getCompanias } from "@/services/companies";
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empleado?: Empleado | null;
}

export default function EmployeeModal({ isOpen, onClose, onSuccess, empleado }: Props) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    cargo: "",
    salario: "",
    compania_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companias, setCompanias] = useState<Compania[]>([]);

  // Load companies for the select dropdown
  useEffect(() => {
    if (isOpen) {
      getCompanias().then(data => {
        const arr = data.datos || data.items || data;
        setCompanias(Array.isArray(arr) ? arr : []);
      }).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (empleado) {
      setFormData({
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        correo: empleado.correo,
        cargo: empleado.cargo,
        salario: empleado.salario.toString(),
        compania_id: empleado.compania_id,
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        cargo: "",
        salario: "",
        compania_id: user?.rol === "USUARIO" ? (user.compania_id || "") : "", // Pre-fill if user has a company_id
      });
    }
    setError("");
  }, [empleado, isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const p = {
        ...formData,
        salario: parseFloat(formData.salario)
      };
      
      if (empleado) {
        await updateEmpleado(empleado.id, p);
      } else {
        await createEmpleado(p);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      let detail = err.response?.data?.mensaje || err.response?.data?.detail;
      // Handle array of validations 
      if (err.response?.data?.errores && err.response.data.errores.length > 0) {
        detail = err.response.data.errores.map((e: any) => e.mensaje).join(", ");
      }
      setError(detail || "Ocurrió un error al guardar el empleado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col slide-in-from-bottom-8 animate-in duration-300 max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">
            {empleado ? "Editar Empleado" : "Nuevo Empleado"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Nombre</label>
                <input 
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                  placeholder="Ej. Juan"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Apellido</label>
                <input 
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                  placeholder="Ej. Pérez"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
              <input 
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                placeholder="ej. jperez@empresa.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Cargo</label>
                <input 
                  type="text"
                  required
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                  placeholder="Ej. Desarrollador"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Salario</label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                  placeholder="Ej. 1500.00"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Compañía Asociada</label>
              <select
                required
                value={formData.compania_id}
                onChange={(e) => setFormData({ ...formData, compania_id: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 bg-white"
                disabled={user?.rol === "USUARIO" && !!user?.compania_id}
              >
                <option value="" disabled>Selecciona una compañía</option>
                {companias.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {empleado ? "Guardar Cambios" : "Crear Empleado"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

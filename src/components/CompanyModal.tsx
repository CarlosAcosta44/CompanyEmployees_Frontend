"use client";

import { useState, useEffect } from "react";
import { Compania, createCompania, updateCompania } from "@/services/companies";
import { Loader2, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  compania?: Compania | null;
}

export default function CompanyModal({ isOpen, onClose, onSuccess, compania }: Props) {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (compania) {
      setFormData({
        nombre: compania.nombre,
        direccion: compania.direccion,
        telefono: compania.telefono,
      });
    } else {
      setFormData({ nombre: "", direccion: "", telefono: "" });
    }
    setError("");
  }, [compania, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (compania) {
        await updateCompania(compania.id, formData);
      } else {
        await createCompania(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.mensaje || err.response?.data?.detail;
      setError(detail || "Ocurrió un error al guardar la compañía");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col slide-in-from-bottom-8 animate-in duration-300">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {compania ? "Editar Compañía" : "Nueva Compañía"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Nombre de la Empresa</label>
            <input 
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              placeholder="Ej. TechCorp SAS"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Dirección</label>
            <input 
              type="text"
              required
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              placeholder="Ej. Calle 10 # 5-20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Teléfono</label>
            <input 
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              placeholder="Ej. 3001234567"
            />
          </div>

          <div className="mt-4 flex gap-3 justify-end">
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
              {compania ? "Guardar Cambios" : "Crear Compañía"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

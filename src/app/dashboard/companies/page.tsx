"use client";

import { useEffect, useState } from "react";
import { getCompanias, deleteCompania, Compania } from "@/services/companies";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Pencil, Trash2, Plus, Loader2, RefreshCw } from "lucide-react";
import CompanyModal from "@/components/CompanyModal";

export default function CompaniesPage() {
  const { user } = useAuth();
  const [companias, setCompanias] = useState<Compania[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompania, setSelectedCompania] = useState<Compania | null>(null);

  const fetchCompanias = async () => {
    setLoading(true);
    try {
      const data = await getCompanias();
      // Fastapi responds PaginatedResponse
      const arrayData = data.datos || data.items || data;
      setCompanias(Array.isArray(arrayData) ? arrayData : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las compañías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanias();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta compañía?")) return;
    try {
      await deleteCompania(id);
      setCompanias((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Error al eliminar la compañía");
    }
  };

  const handleOpenModal = (compania?: Compania) => {
    setSelectedCompania(compania || null);
    setIsModalOpen(true);
  };

  // POLICIES
  // Admin Bogota: No Eliminar, Si Patch
  // Admin Medellin: Si Eliminar, No Patch
  const canDelete = user?.rol === "ADMIN" && user?.ciudad !== "BOGOTA";
  const canEdit = user?.rol === "ADMIN" && user?.ciudad !== "MEDELLIN";
  const canCreate = user?.rol === "ADMIN";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Directorio de Compañías</h2>
          <p className="text-slate-500 text-sm">Gestiona la información corporativa.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchCompanias}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            title="Recargar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          {canCreate && (
            <button 
              onClick={() => handleOpenModal()} 
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-indigo-600/30"
            >
              <Plus className="w-5 h-5" />
              Nueva Compañía
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">{error}</div>
      ) : loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Empresa</th>
                  <th className="px-6 py-4 font-semibold">Dirección</th>
                  <th className="px-6 py-4 font-semibold">Teléfono</th>
                  <th className="px-6 py-4 font-semibold">Fecha Registro</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companias.map((compania) => (
                  <tr key={compania.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800">{compania.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{compania.direccion}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-mono">{compania.telefono}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(compania.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={!canEdit}
                          onClick={() => handleOpenModal(compania)}
                          className={`p-2 rounded-lg transition-colors ${
                            canEdit 
                              ? "text-blue-600 hover:bg-blue-50" 
                              : "text-slate-300 cursor-not-allowed"
                          }`}
                          title={canEdit ? "Editar" : "No tienes permisos de Edición (Política de ciudad)"}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          disabled={!canDelete}
                          onClick={() => handleDelete(compania.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            canDelete 
                              ? "text-red-600 hover:bg-red-50" 
                              : "text-slate-300 cursor-not-allowed"
                          }`}
                          title={canDelete ? "Eliminar" : "No tienes permisos de Eliminación (Política de ciudad)"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {companias.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron compañías registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCompanias}
        compania={selectedCompania}
      />
    </div>
  );
}

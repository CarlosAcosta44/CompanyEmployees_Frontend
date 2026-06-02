"use client";

import { useEffect, useState } from "react";
import { getEmpleados, deleteEmpleado, Empleado } from "@/services/employees";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Pencil, Trash2, Plus, Loader2, RefreshCw, Briefcase, Mail } from "lucide-react";
import EmployeeModal from "@/components/EmployeeModal";

export default function EmployeesPage() {
  const { user } = useAuth();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const data = await getEmpleados();
      const arrayData = data.datos || data.items || data;
      setEmpleados(Array.isArray(arrayData) ? arrayData : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los empleados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este empleado?")) return;
    try {
      await deleteEmpleado(id);
      setEmpleados((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Error al eliminar el empleado");
    }
  };
  
  const handleOpenModal = (empleado?: Empleado) => {
    setSelectedEmpleado(empleado || null);
    setIsModalOpen(true);
  };

  // POLICIES
  // Admin Bogota: No Eliminar, Si Patch
  // Admin Medellin: Si Eliminar, No Patch
  const canDelete = user?.rol === "ADMIN" && user?.ciudad !== "BOGOTA";
  const canEdit = user?.rol === "ADMIN" && user?.ciudad !== "MEDELLIN";
  const canCreate = user?.rol === "ADMIN" || user?.rol === "USUARIO"; // Based on reqs

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Nómina de Empleados</h2>
          <p className="text-slate-500 text-sm">Administra el personal del sistema.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchEmpleados}
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
               Nuevo Empleado
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
                  <th className="px-6 py-4 font-semibold">Empleado</th>
                  <th className="px-6 py-4 font-semibold">Cargo</th>
                  <th className="px-6 py-4 font-semibold">Salario</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {empleados.map((empleado) => (
                  <tr key={empleado.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                          {empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{empleado.nombre} {empleado.apellido}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {empleado.correo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {empleado.cargo}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-mono font-medium text-emerald-600">
                      ${Number(empleado.salario).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={!canEdit}
                          onClick={() => handleOpenModal(empleado)}
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
                          onClick={() => handleDelete(empleado.id)}
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
                {empleados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron empleados registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmpleados}
        empleado={selectedEmpleado}
      />
    </div>
  );
}

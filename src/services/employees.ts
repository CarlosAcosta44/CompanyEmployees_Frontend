import api from "./api";

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  salario: string | number;
  compania_id: string;
}

export const getEmpleados = async (page = 1, size = 100) => {
  const res = await api.get(`/empleados?pagina=${page}&tamano=${size}`);
  return res.data;
};

export const createEmpleado = async (data: Partial<Empleado>) => {
  const res = await api.post("/empleados", data);
  return res.data;
};

export const updateEmpleado = async (id: string, data: Partial<Empleado>) => {
  const res = await api.put(`/empleados/${id}`, data);
  return res.data;
};

export const deleteEmpleado = async (id: string) => {
  const res = await api.delete(`/empleados/${id}`);
  return res.data;
};

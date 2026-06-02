import api from "./api";

export interface Compania {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  fecha_creacion: string;
}

export const getCompanias = async (page = 1, size = 100) => {
  const res = await api.get(`/companias?pagina=${page}&tamano=${size}`);
  return res.data; // Assumes structure PaginatedResponse
};

export const createCompania = async (data: Partial<Compania>) => {
  const res = await api.post("/companias", data);
  return res.data;
};

export const updateCompania = async (id: string, data: Partial<Compania>) => {
  const res = await api.put(`/companias/${id}`, data);
  return res.data;
};

export const deleteCompania = async (id: string) => {
  const res = await api.delete(`/companias/${id}`);
  return res.data;
};

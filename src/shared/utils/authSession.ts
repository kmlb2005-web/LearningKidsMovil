export type AuthUser = {
  idUsuario: number;
  nombre: string;
  username: string;
  idRol: number;
};

let currentUser: AuthUser | null = null;

export const setAuthenticatedUser = (user: AuthUser) => {
  currentUser = user;
};

export const getAuthenticatedUser = () => currentUser;

export const clearAuthenticatedUser = () => {
  currentUser = null;
};

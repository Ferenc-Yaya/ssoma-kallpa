export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    rol: string;
    tenant: string;
  };
}

// Usuario de prueba
export const MOCK_USER = {
  username: 'admin',
  password: 'admin123',
  response: {
    token: 'mock-jwt-token-12345',
    user: {
      id: 1,
      nombre: 'Juan Pérez',
      rol: 'SUPERVISOR_EHS',
      tenant: 'KALLPA'
    }
  }
};
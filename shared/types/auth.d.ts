// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
  }

  interface UserSession {}

  interface SecureSessionData {}
}

export {};

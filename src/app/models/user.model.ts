export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username?: string;
  }

  export interface SignInCredentials {
    email: string;
    password: string;
    username: string;
  }
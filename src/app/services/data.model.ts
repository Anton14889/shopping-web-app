export interface Data {
  email: string;
  isAdmin?: boolean;
  cartSize?: number;
  favoritSize?: number;
  user?: {
    displayName: string;
    photoURL: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
  }
}
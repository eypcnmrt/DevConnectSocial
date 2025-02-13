export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  phoneNumber: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
}

// types/user.ts and types/userRole.ts


export interface User {
  USER_ID: string;
  NAME: string;
  SURNAME: string;
}

export interface UserRole {
  USER_ID: string;
  ROLE: string;
}


export interface SelectedUser {
  USER_ID: string;
  NAME: string;
  SURNAME: string;
  ROLE: string;
}
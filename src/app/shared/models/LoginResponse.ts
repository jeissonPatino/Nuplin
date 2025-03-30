export interface LoginResponse {
    sub: string;
    profile: string;
    userRegistered: string;
    token: string;
    activationType: string;
    password: string;
    id: number;
    userType: string;
    partnerId: string;
    resetToken: string;
    exp: number;
    email: string;
    status: number;
  }
/* eslint-disable no-unused-vars */
export interface IUser {
  id?: number;
  role?: UserRole;
  userName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  country?: string;
  telephone?: string;
  mobile?: string;
  billingAddress?: string;
  password: string;
  createdAt?: string;
  deletedAt?: string;
  updatedAt?: string;
}

export interface IBackOfficer {
  id?: number;
  role?: BackOfficeRole;
  username: string;
  password: string;
  createdAt?: string;
  deletedAt?: string;
  updatedAt?: string;
}

export interface ISubscription {
  numberOfMonths: number;
}

enum UserRole {
  Admin,
  User,
}

enum BackOfficeRole {
  Admin,
  Treasurer,
  Enforcer,
}

export interface IViolationsPenalty {
  penaltyId: {
    penaltyDescription: string;
    penalty: number;
  };
}
[];

export interface IOtherViolationsPenalty {
  penaltyId: {
    penaltyDescription: string;
    penalty: number;
  };
}
[];

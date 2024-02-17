export interface RoleParams {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  blocked: boolean;
  isActive: boolean;
}

export interface MedusaUserParams extends RoleParams {
  confirmed: boolean;
  blocked: boolean;
  provider: string;
  role?: number;
}

export interface MedusaData {
  status: number;
  data: any;
  error?: Error;
}

export type StrapiSeedType =
  | Record<string, { medusa_id?: string }[]>
  | Record<string, { medusa_id?: string }>
  | { medusa_id?: string };

export interface StrapiSeedInterface {
  meta: {
    pageNumber: number;
    pageLimit: number;
    hasMore: Record<string, boolean>;
  };
  data: Record<string, StrapiSeedType[]>;
}

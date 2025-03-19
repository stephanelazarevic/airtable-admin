export type User = {
    id: string;
    fields: {
      first_name: string;
      last_name: string;
      status: string;
      email: string;
      admin: boolean;
      password: string;
    };
  };
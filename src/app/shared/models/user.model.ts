export class User {
    id : number;
    last_name: string;
    first_name: string;
    email: string;
    password: string;
    money:number;
    cooker: boolean;
  }

  export interface UserList {
    id : number;
    last_name: string;
    first_name: string;
    money:number;
  }

export interface User {
  id?:number,
  userName: string,
  email: string,
  phoneNumber: string,
  rolesId: string[],
  level: number
}

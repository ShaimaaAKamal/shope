export interface User {
  id?:string,
  userName: string,
  email: string,
  phoneNumber: string,
  rolesId: [
    string
  ],
  applicationsId: number[],
  level: number
}

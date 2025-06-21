

export interface Customer{
  id?:number,
  firstNameEn: string,
  firstNameAr: string,
  lastNameEn: string,
  lastNameAr: string,
  companyNameEn: string,
  companyNameAr: string,
  phone: string,
  emailAddress:string,
  country: string,
  city: string,
  addressEn: string,
  addressAr: string,
  notesEn: string,
  notesAr: string,
  dateOfBirth: Date,
  crn: string,
  vat: string,
  governorate: string,
  streetNumber: string,
  buildingNumber: string,
  isActive: boolean,
  customerType: number
}


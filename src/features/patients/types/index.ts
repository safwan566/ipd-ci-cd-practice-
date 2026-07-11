export type PatientSex = 'MALE' | 'FEMALE' | 'OTHER';

export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface PatientRecord {
  id: string;
  registrationNumber: string;
  admissionDate: string;
  patientName: string;
  age: number;
  dateOfBirth: string;
  sex: PatientSex;
  address: PatientAddress;
  mobile: string;
  nidNumber: string;
  nidImageFront: string;
  nidImageBack: string;
}

export interface PatientFormInput {
  registrationNumber: string;
  admissionDate: string;
  patientName: string;
  age: number;
  dateOfBirth: string;
  sex: PatientSex;
  address: PatientAddress;
  mobile: string;
  nidNumber: string;
  nidImageFront: string | null;
  nidImageBack: string | null;
}

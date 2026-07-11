export type AppointmentStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export type AppointmentType = 
  | 'Consultation'
  | 'Follow-up'
  | 'Surgery'
  | 'Lab Test'
  | 'Therapy'
  | 'Vaccination'
  | 'Emergency';

export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  date: string;
  time: string;
  duration: number;
  room: string;
  notes?: string;
}

export interface AppointmentFormInput {
  patientName: string;
  doctorName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  date: string;
  time: string;
  duration: number;
  room: string;
  notes?: string;
}

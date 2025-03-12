export interface Attendee {
  id?: number;
  name: string;
  phone_number: string;
  email: string;
  job_title?: string;
  company: string;
  group_size: number;
  dietary_preferences?: string;
  additional_comments?: string;
  confirmation_date?: string;
}

export interface AttendeeFormData {
  name: string;
  phone_number: string;
  email: string;
  job_title?: string;
  company: string;
  group_size: number;
  dietary_preferences?: string;
  additional_comments?: string;
}

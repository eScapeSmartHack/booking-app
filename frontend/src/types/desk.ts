export type DeskStatus = 
  | 'available' 
  | 'booked' 
  | 'colleague' 
  | 'team-member' 
  | 'closed' 
  | 'awaiting-cleaning' 
  | 'hidden' 
  | 'fixed-space';

export interface DeskPosition {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

export interface Desk {
  id: string;
  name: string;
  position: DeskPosition;
  status: DeskStatus;
  floor: string;
  attributes?: string[];
  bookedBy?: string;
  bookedDate?: string;
}

export interface DeskBooking {
  deskId: string;
  userName: string;
  date: string;
  startTime?: string;
  endTime?: string;
}


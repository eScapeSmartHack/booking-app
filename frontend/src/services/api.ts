/**
 * API Service - Real Backend Integration
 * 
 * Backend Models (Prisma):
 * - Room: { id: number, data: string }
 * - Booking: { id: number, id_room: number, id_user: number, start: string, end: string }
 * - User: { id: number, name: string, password: string, avatar: string }
 */

import { Desk, Booking as FrontendBooking } from '@/types/desk';
import { generate216Desks } from '@/utils/generateDesks';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Mock data types matching backend structure
interface BackendRoom {
  id: number;
  data: string; // JSON string containing desk data
}

interface BackendBooking {
  id: number;
  id_room: number;
  id_user: number;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
}

interface BackendUser {
  id: number;
  name: string;
  password: string;
  avatar: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  } | null;
}

interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  } | null;
}

/**
 * Real API Service - Connects to FastAPI Backend
 */
class ApiService {
  private users: BackendUser[] = [];
  private usersLoaded = false;

  constructor() {
    // Load users once on initialization
    this.loadUsers();
  }

  /**
   * Load users from backend
   */
  private async loadUsers() {
    try {
      const response = await this.fetchWithErrorHandling<{ message: string; users: BackendUser[] }>(
        `${API_BASE_URL}/users`
      );
      this.users = response.users;
      this.usersLoaded = true;
    } catch (error) {
      console.error('Failed to load users, using fallback:', error);
      // Fallback users
      this.users = [
        { id: 1, name: 'You', password: '', avatar: '' },
      ];
      this.usersLoaded = true;
    }
  }

  /**
   * Fetch with error handling
   */
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        // Try to extract error detail from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get user ID by name
   */
  private async getUserIdByName(name: string): Promise<number> {
    // Wait for users to be loaded
    if (!this.usersLoaded) {
      await this.loadUsers();
    }
    
    const user = this.users.find(u => u.name === name);
    return user?.id || 1; // Default to user ID 1
  }

  /**
   * Format date and time to ISO string
   */
  private formatToISO(date: string, time: string): string {
    return `${date}T${time}:00`;
  }

  /**
   * Parse ISO string to date and time
   */
  private parseISO(isoString: string): { date: string; time: string } {
    const [date, time] = isoString.split('T');
    const [hours, minutes] = time.split(':');
    return { date, time: `${hours}:${minutes}` };
  }

  /**
   * GET /rooms
   * Get all rooms (desks) from backend
   */
  async getRooms(): Promise<{ message: string; rooms: BackendRoom[] }> {
    const response = await this.fetchWithErrorHandling<{ message: string; rooms: BackendRoom[] }>(
      `${API_BASE_URL}/rooms`
    );
    return response;
  }

  /**
   * GET /bookings/booking
   * Get all bookings from backend
   */
  async getBookings(): Promise<{ message: string; bookings: BackendBooking[] }> {
    const response = await this.fetchWithErrorHandling<{ message: string; bookings: BackendBooking[] }>(
      `${API_BASE_URL}/bookings/booking`
    );
    return response;
  }

  /**
   * POST /bookings/booking
   * Create a new booking in backend
   */
  async createBooking(booking: Omit<BackendBooking, 'id'>): Promise<{ message: string; booking: BackendBooking }> {
    const response = await this.fetchWithErrorHandling<{ message: string; booking: BackendBooking }>(
      `${API_BASE_URL}/bookings/booking`,
      {
        method: 'POST',
        body: JSON.stringify(booking),
      }
    );
    return response;
  }

  /**
   * GET /users
   * Get all users from backend
   */
  async getUsers(): Promise<{ message: string; users: BackendUser[] }> {
    // Wait for users to be loaded if not already
    if (!this.usersLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return {
      message: 'List of users',
      users: this.users,
    };
  }

  /**
   * POST /users/login
   * Authenticate user with username and password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.fetchWithErrorHandling<LoginResponse>(
      `${API_BASE_URL}/users/login`,
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    return response;
  }

  /**
   * PUT /users/avatar
   * Update user avatar
   */
  async updateAvatar(userId: number, avatar: string): Promise<UpdateAvatarResponse> {
    const response = await this.fetchWithErrorHandling<UpdateAvatarResponse>(
      `${API_BASE_URL}/users/avatar`,
      {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId, avatar }),
      }
    );
    return response;
  }

  /**
   * Transform backend data to frontend Desk format
   */
  async transformRoomsToDesks(rooms: BackendRoom[], bookings: BackendBooking[]): Promise<Desk[]> {
    // Ensure users are loaded
    if (!this.usersLoaded) {
      await this.loadUsers();
    }

    const desks: Desk[] = rooms.map(room => {
      const desk: Desk = JSON.parse(room.data);
      
      // Find bookings for this room
      const roomBookings = bookings.filter(b => b.id_room === room.id);
      
      if (roomBookings.length > 0) {
        // For meeting rooms and recreational spaces, use bookings array
        if (desk.type === 'meeting-room' || desk.type === 'recreational') {
          desk.bookings = roomBookings.map(booking => {
            const { date, time: startTime } = this.parseISO(booking.start);
            const { time: endTime } = this.parseISO(booking.end);
            const user = this.users.find(u => u.id === booking.id_user);
            
            return {
              deskId: desk.id,
              userName: user?.name || 'Unknown',
              date,
              startTime,
              endTime,
            };
          });
        } else {
          // For regular desks, use the first booking
          const firstBooking = roomBookings[0];
          const { date, time: startTime } = this.parseISO(firstBooking.start);
          const { time: endTime } = this.parseISO(firstBooking.end);
          const user = this.users.find(u => u.id === firstBooking.id_user);
          
          desk.status = 'booked';
          desk.bookedBy = user?.name || 'Unknown';
          desk.bookedDate = date;
          desk.bookedStartTime = startTime;
          desk.bookedEndTime = endTime;
        }
      }
      
      return desk;
    });
    
    return desks;
  }

  /**
   * Transform frontend booking to backend format
   */
  async transformBookingToBackend(
    deskId: number,
    date: string,
    startTime: string,
    endTime: string,
    userName: string
  ): Promise<Omit<BackendBooking, 'id'>> {
    const userId = await this.getUserIdByName(userName);
    
    return {
      id_room: deskId,
      id_user: userId,
      start: this.formatToISO(date, startTime),
      end: this.formatToISO(date, endTime),
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Keep mock service for fallback/development
class MockApiService {
  private rooms: BackendRoom[] = [];
  private bookings: BackendBooking[] = [];
  private users: BackendUser[] = [
    { id: 1, name: 'You', password: '', avatar: '' },
  ];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Check if we're in browser (not SSR)
    if (typeof window === 'undefined') {
      // In SSR, just use generated desks
      const desks = generate216Desks();
      this.rooms = desks.map(desk => ({
        id: desk.id,
        data: JSON.stringify(desk),
      }));
      return;
    }

    const savedDesks = localStorage.getItem('desk-layout');
    let desks: Desk[];
    
    if (savedDesks) {
      try {
        desks = JSON.parse(savedDesks);
      } catch (error) {
        desks = generate216Desks();
      }
    } else {
      desks = generate216Desks();
    }
    
    this.rooms = desks.map(desk => ({
      id: desk.id,
      data: JSON.stringify(desk),
    }));
  }

  async getRooms() {
    return { message: 'List of rooms', rooms: this.rooms };
  }

  async getBookings() {
    return { message: 'List of bookings', bookings: this.bookings };
  }

  async createBooking(booking: Omit<BackendBooking, 'id'>) {
    const newBooking: BackendBooking = {
      id: Date.now(),
      ...booking,
    };
    this.bookings.push(newBooking);
    return { message: 'Booking created', booking: newBooking };
  }

  async getUsers() {
    return { message: 'List of users', users: this.users };
  }

  async transformRoomsToDesks(rooms: BackendRoom[], bookings: BackendBooking[]): Promise<Desk[]> {
    return await apiService.transformRoomsToDesks(rooms, bookings);
  }

  async transformBookingToBackend(deskId: number, date: string, startTime: string, endTime: string, userName: string) {
    return await apiService.transformBookingToBackend(deskId, date, startTime, endTime, userName);
  }
}

export const mockApiService = new MockApiService();


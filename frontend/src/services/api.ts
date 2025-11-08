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
  date: string; // YYYY-MM-DD format
  start: string; // HH:MM format (time only)
  end: string; // HH:MM format (time only)
  user?: {
    id: number;
    name: string;
    avatar: string;
  } | null;
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
   * GET /users/bookings/user/{id_user}/next-two-weeks
   * Get upcoming bookings for a specific user (next 2 weeks)
   */
  async getUserBookings(userId: number): Promise<{ user_id: number; user_name: string; bookings: Array<{ id: number; id_room: number; date: string; start: string; end: string }>; bookings_count: number; period: { start_date: string; end_date: string } }> {
    const response = await this.fetchWithErrorHandling<{ user_id: number; user_name: string; bookings: Array<{ id: number; id_room: number; date: string; start: string; end: string }>; bookings_count: number; period: { start_date: string; end_date: string } }>(
      `${API_BASE_URL}/users/bookings/user/${userId}/next-two-weeks`
    );
    return response;
  }

  /**
   * POST /bookings/booking
   * Create a new booking in backend
   * Backend expects: { id_room, id_user, date: "YYYY-MM-DD", start: "HH:MM", end: "HH:MM" }
   */
  async createBooking(booking: { id_room: number; id_user: number; date: string; start: string; end: string }): Promise<{ message: string; booking: any }> {
    const response = await this.fetchWithErrorHandling<{ message: string; booking: any }>(
      `${API_BASE_URL}/bookings/booking`,
      {
        method: 'POST',
        body: JSON.stringify(booking),
      }
    );
    return response;
  }

  /**
   * PUT /bookings/booking/{booking_id}
   * Update a booking by ID
   */
  async updateBooking(bookingId: number, booking: { date: string; start: string; end: string }): Promise<{ message: string; booking: any }> {
    const response = await this.fetchWithErrorHandling<{ message: string; booking: any }>(
      `${API_BASE_URL}/bookings/booking/${bookingId}`,
      {
        method: 'PUT',
        body: JSON.stringify(booking),
      }
    );
    return response;
  }

  /**
   * DELETE /bookings/booking/{booking_id}
   * Delete a booking by ID
   */
  async deleteBooking(bookingId: number): Promise<{ message: string; booking: any }> {
    const response = await this.fetchWithErrorHandling<{ message: string; booking: any }>(
      `${API_BASE_URL}/bookings/booking/${bookingId}`,
      {
        method: 'DELETE',
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
   * @param filterDate Optional date string (YYYY-MM-DD) to filter bookings by date
   */
  async transformRoomsToDesks(rooms: BackendRoom[], bookings: BackendBooking[], filterDate?: string): Promise<Desk[]> {
    // Ensure users are loaded
    if (!this.usersLoaded) {
      await this.loadUsers();
    }

    // Filter bookings by date if filterDate is provided
    let filteredBookings = bookings;
    if (filterDate) {
      filteredBookings = bookings.filter(b => b.date === filterDate);
    }

    const desks: Desk[] = rooms.map(room => {
      const desk: Desk = JSON.parse(room.data);
      
      // Find bookings for this room (already filtered by date if filterDate was provided)
      const roomBookings = filteredBookings.filter(b => b.id_room === room.id);
      
      if (roomBookings.length > 0) {
        // For meeting rooms and recreational spaces, use bookings array
        if (desk.type === 'meeting-room' || desk.type === 'recreational') {
          desk.bookings = roomBookings.map(booking => {
            // Backend returns: date (YYYY-MM-DD), start (HH:MM), end (HH:MM)
            const date = booking.date || '';
            const startTime = booking.start || '';
            const endTime = booking.end || '';
            // Use user data from booking if available, otherwise fallback to users list
            const user = booking.user || this.users.find(u => u.id === booking.id_user);
            
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
          // Backend returns: date (YYYY-MM-DD), start (HH:MM), end (HH:MM)
          const date = firstBooking.date || '';
          const startTime = firstBooking.start || '';
          const endTime = firstBooking.end || '';
          
          // Use user data from booking if available, otherwise fallback to users list
          const user = firstBooking.user || this.users.find(u => u.id === firstBooking.id_user);
          
          desk.status = 'booked';
          desk.bookedBy = user?.name || 'Unknown';
          // Get avatar from user - ensure it's not empty string
          const avatar = user?.avatar || '';
          desk.bookedByAvatar = (avatar && avatar.trim() !== '') ? avatar : undefined;
          desk.bookedDate = date;
          desk.bookedStartTime = startTime;
          desk.bookedEndTime = endTime;
        }
      } else {
        // No bookings for this date - reset desk to available
        if (desk.type === 'meeting-room' || desk.type === 'recreational') {
          desk.bookings = [];
        } else {
          desk.status = 'available';
          desk.bookedBy = undefined;
          desk.bookedByAvatar = undefined;
          desk.bookedDate = undefined;
          desk.bookedStartTime = undefined;
          desk.bookedEndTime = undefined;
        }
      }
      
      return desk;
    });
    
    return desks;
  }

  /**
   * Transform frontend booking to backend format
   * Backend expects: { id_room, id_user, date: "YYYY-MM-DD", start: "HH:MM", end: "HH:MM" }
   */
  async transformBookingToBackend(
    deskId: number,
    date: string,
    startTime: string,
    endTime: string,
    userName?: string
  ): Promise<{ id_room: number; id_user: number; date: string; start: string; end: string }> {
    // Get user ID from localStorage if available, otherwise fallback to name lookup
    let userId: number;
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id;
        } catch {
          // Fallback to name lookup
          userId = await this.getUserIdByName(userName || 'You');
        }
      } else {
        userId = await this.getUserIdByName(userName || 'You');
      }
    } else {
      userId = await this.getUserIdByName(userName || 'You');
    }
    
    return {
      id_room: deskId,
      id_user: userId,
      date: date, // Already in YYYY-MM-DD format
      start: startTime, // Time format like "09:00"
      end: endTime, // Time format like "17:00"
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


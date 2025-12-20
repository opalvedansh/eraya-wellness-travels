/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form request
 */
export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Contact form response
 */
export interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Auth types
 */
export interface RequestOTPRequest {
  email: string;
}

export interface RequestOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    isVerified: boolean;
  };
  token?: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
}


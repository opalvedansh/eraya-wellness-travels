import { z } from "zod";

// Email validation schema
export const emailSchema = z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim();

// OTP validation schema
export const otpSchema = z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits");

// Request OTP schema
export const requestOTPSchema = z.object({
    email: emailSchema,
});

// Verify OTP schema
export const verifyOTPSchema = z.object({
    email: emailSchema,
    otp: otpSchema,
});

// Resend OTP schema
export const resendOTPSchema = z.object({
    email: emailSchema,
});

// Contact form schema
export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long").trim(),
    email: emailSchema,
    phone: z.string().optional(),
    subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject is too long").trim(),
    message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long").trim(),
});

// Customize trip schema
export const customizeTripSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long").trim(),
    email: emailSchema,
    phone: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    groupSize: z.string().min(1, "Group size is required"),
    budget: z.string().min(1, "Budget range is required"),
    interests: z.array(z.string()).default([]),
    additionalNotes: z.string().max(2000, "Notes are too long").optional(),
    tripName: z.string().optional(),
});

// Export types
export type RequestOTPInput = z.infer<typeof requestOTPSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type ResendOTPInput = z.infer<typeof resendOTPSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CustomizeTripInput = z.infer<typeof customizeTripSchema>;


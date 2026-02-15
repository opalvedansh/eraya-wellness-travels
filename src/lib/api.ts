import { supabase } from "@/lib/supabaseClient";
import { API_BASE_URL } from "./config";

/**
 * Make an authenticated API call with Supabase token
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error("No active session");
    }

    const isFormData = options.body instanceof FormData;

    const baseHeaders: HeadersInit = {
        Authorization: `Bearer ${session.access_token}`,
    };

    const headers: HeadersInit = isFormData
        ? baseHeaders
        : {
            ...baseHeaders,
            ...options.headers,
            "Content-Type": "application/json",
        };

    return fetch(fullUrl, {
        ...options,
        headers,
        credentials: "include",
    });
}

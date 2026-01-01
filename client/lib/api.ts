import { supabase } from "@/lib/supabaseClient";

/**
 * Make an authenticated API call with Supabase token
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    // Get current Supabase session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error("No active session");
    }

    // Add Authorization header with Supabase token
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
    };

    return fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });
}

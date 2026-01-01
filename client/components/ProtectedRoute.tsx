import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authenticatedFetch } from "@/lib/api";

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

    useEffect(() => {
        if (requireAdmin && user) {
            checkAdminStatus();
        }
    }, [requireAdmin, user]);

    const checkAdminStatus = async () => {
        try {
            const response = await authenticatedFetch("/api/admin/dashboard/stats");
            setIsAdmin(response.ok);
        } catch (error) {
            console.error("Admin check failed:", error);
            setIsAdmin(false);
        } finally {
            setCheckingAdmin(false);
        }
    };

    if (isLoading || checkingAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && isAdmin === false) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access the admin panel.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

import { useEffect, useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface Settings {
    payments_enabled: boolean;
    maintenance_mode: boolean;
    booking_enabled: boolean;
    show_prices: boolean;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<Settings>({
        payments_enabled: false,
        maintenance_mode: false,
        booking_enabled: true,
        show_prices: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setSettings((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: keyof Settings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save each setting individually
            const promises = Object.entries(settings).map(([key, value]) =>
                fetch(`/api/admin/settings/${key}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        value,
                        description: getSettingDescription(key),
                    }),
                })
            );

            await Promise.all(promises);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const getSettingDescription = (key: string): string => {
        const descriptions: Record<string, string> = {
            payments_enabled: "Enable online payment processing",
            maintenance_mode: "Put website in maintenance mode",
            booking_enabled: "Allow users to create bookings",
            show_prices: "Display prices on website",
        };
        return descriptions[key] || "";
    };

    const getSettingTitle = (key: string): string => {
        return key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const getSettingHelp = (key: keyof Settings): string => {
        const help: Record<string, string> = {
            payments_enabled:
                "When enabled, customers can pay online via Stripe. When disabled, they'll see a 'Contact us to book' message.",
            maintenance_mode:
                "When enabled, only admins can access the site. Visitors will see a 'Coming Soon' message.",
            booking_enabled:
                "When enabled, booking forms are accessible. When disabled, booking buttons are hidden.",
            show_prices:
                "When enabled, tour and trek prices are displayed. When disabled, prices are hidden and users must contact for pricing.",
        };
        return help[key] || "";
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark">Loading settings...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your website features and behavior</p>
                </div>

                <div className="max-w-3xl space-y-6">
                    {/* Settings Cards */}
                    {(Object.keys(settings) as Array<keyof Settings>).map((key) => (
                        <div key={key} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <SettingsIcon className="w-5 h-5 text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {getSettingTitle(key)}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{getSettingHelp(key)}</p>

                                    {/* Current Status */}
                                    <div className="mt-3">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${settings[key]
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {settings[key] ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(key)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 ${settings[key] ? "bg-green-primary" : "bg-gray-200"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings[key] ? "translate-x-7" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Important Warnings */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
                        <ul className="space-y-2 text-sm text-yellow-800">
                            <li>
                                • <strong>Payments Enabled:</strong> Only enable this after setting up Stripe live
                                keys and webhook in environment variables.
                            </li>
                            <li>
                                • <strong>Maintenance Mode:</strong> Be careful! This will make your website
                                inaccessible to regular visitors.
                            </li>
                            <li>
                                • <strong>Booking Enabled:</strong> If disabled, users won't be able to make any
                                bookings (useful during business registration period).
                            </li>
                        </ul>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {saving ? "Saving..." : "Save Settings"}
                        </button>

                        <p className="text-sm text-gray-500">
                            Changes take effect immediately after saving
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>
                                • You can deploy the website with payments disabled and enable them later when
                                your business is registered.
                            </li>
                            <li>
                                • During the initial phase, disable booking and have users contact you directly
                                via email or WhatsApp.
                            </li>
                            <li>
                                • Test payment flows in development before enabling payments in production.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

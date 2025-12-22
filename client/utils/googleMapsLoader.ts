/**
 * Google Maps JavaScript API Loader
 * Dynamically loads the Google Maps API and returns a promise
 */

// Replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDM0JamGsbkb0ucN5528xgvP9b_gofEQ7Q';

let isLoading = false;
let isLoaded = false;

export const loadGoogleMapsAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // If already loaded, resolve immediately
        if (isLoaded && (window as any).google && (window as any).google.maps) {
            resolve();
            return;
        }

        // If currently loading, wait for it
        if (isLoading) {
            const checkInterval = setInterval(() => {
                if (isLoaded && (window as any).google && (window as any).google.maps) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            return;
        }

        // Start loading
        isLoading = true;

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            isLoaded = true;
            isLoading = false;
            resolve();
        };

        script.onerror = () => {
            isLoading = false;
            reject(new Error('Failed to load Google Maps API'));
        };

        document.head.appendChild(script);
    });
};

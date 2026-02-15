import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-beige">
            <h1 className="text-6xl font-bold text-green-primary mb-4">404</h1>
            <p className="text-xl text-text-dark mb-8">Page not found</p>
            <Link href="/" className="btn-premium">
                Return Home
            </Link>
        </div>
    );
}

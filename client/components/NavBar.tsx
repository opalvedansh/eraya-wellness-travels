import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, User, Bookmark } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const pageLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/tour", label: "Tours" },
    { href: "/trek", label: "Treks" },
    { href: "/spiritual-insights", label: "Spiritual" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-beige border-b border-beige-dark/15 px-2 sm:px-3 md:px-6 lg:px-12 py-1.5 sm:py-2 md:py-2.5 lg:py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 md:gap-4 lg:gap-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/eraya-logo.png"
            alt="Eraya Wellness Travels"
            className="w-20 sm:w-24 md:w-28 lg:w-28 xl:w-32 h-auto"
            style={{ filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))" }}
          />
        </Link>

        {/* Center Page Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-text-dark flex-1 justify-center">
          {pageLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? window.location.pathname === "/"
                : window.location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap uppercase tracking-tight py-2 ${isActive
                  ? "text-green-primary font-bold border-b border-green-primary"
                  : "text-text-dark hover:text-green-primary"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-4 flex-shrink-0">
          <a
            href="tel:+9779765548080"
            className="hidden lg:inline text-text-dark hover:text-green-primary transition-colors whitespace-nowrap text-xs lg:text-sm font-medium py-2"
          >
            📞 +9779765548080
          </a>

          {user ? (
            <div className="relative inline-block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-text-dark hover:text-green-primary transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-1 md:gap-1.5 lg:gap-1.5 text-xs lg:text-sm font-medium py-2 touch-target-min"
              >
                <User className="h-3.5 sm:h-4 md:h-4 lg:h-4 w-3.5 sm:w-4 md:w-4 lg:w-4 flex-shrink-0" />
                <span className="hidden lg:inline">{user.name}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <Link
                    to="/my-bookings"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-4 py-3 text-text-dark hover:bg-muted transition-colors flex items-center gap-2 border-b border-border"
                  >
                    <Bookmark className="h-4 w-4 text-green-primary" />
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-4 py-3 text-text-dark hover:bg-muted transition-colors flex items-center gap-2 border-b border-border"
                  >
                    <User className="h-4 w-4 text-green-primary" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-text-dark hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4 text-green-primary" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden lg:inline text-text-dark hover:text-green-primary transition-colors whitespace-nowrap text-xs lg:text-sm font-medium py-2"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden text-text-dark hover:text-green-primary transition-colors p-1.5 sm:p-2 md:p-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 sm:h-5 md:h-6 w-5 sm:w-5 md:w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[320px] md:w-[360px] bg-beige p-3 sm:p-4 md:p-6"
            >
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-green-primary mb-1 sm:mb-2">
                  Navigation
                </h2>
                <nav className="flex flex-col gap-0.5 sm:gap-1">
                  {pageLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs sm:text-sm md:text-base text-text-dark hover:text-green-primary transition-colors py-2.5 sm:py-3 md:py-3 px-2.5 sm:px-3 md:px-3 hover:bg-beige-light rounded-lg touch-target-min"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-0.5 sm:gap-1 pt-2 sm:pt-3 border-t border-beige-dark">
                  <a
                    href="tel:+9779765548080"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs sm:text-sm md:text-base text-text-dark hover:text-green-primary transition-colors py-2.5 sm:py-3 md:py-3 px-2.5 sm:px-3 md:px-3 hover:bg-beige-light rounded-lg touch-target-min"
                  >
                    📞 +9779765548080
                  </a>
                  {user ? (
                    <>
                      <Link
                        to="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-left text-xs sm:text-sm md:text-base text-text-dark hover:text-green-primary transition-colors flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 md:py-3 px-2.5 sm:px-3 md:px-3 hover:bg-beige-light rounded-lg touch-target-min"
                      >
                        <Bookmark className="h-3.5 sm:h-4 md:h-4 w-3.5 sm:w-4 md:w-4 flex-shrink-0" />
                        My Bookings
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-left text-xs sm:text-sm md:text-base text-text-dark hover:text-green-primary transition-colors flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 md:py-3 px-2.5 sm:px-3 md:px-3 hover:bg-beige-light rounded-lg touch-target-min"
                      >
                        <User className="h-3.5 sm:h-4 md:h-4 w-3.5 sm:w-4 md:w-4 flex-shrink-0" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left text-xs sm:text-sm md:text-base text-text-dark hover:text-green-primary transition-colors flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 md:py-3 px-2.5 sm:px-3 md:px-3 hover:bg-beige-light rounded-lg touch-target-min"
                      >
                        <LogOut className="h-3.5 sm:h-4 md:h-4 w-3.5 sm:w-4 md:w-4 flex-shrink-0" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs sm:text-sm md:text-base text-text-dark hover:text-green-primary transition-colors py-2.5 sm:py-3 md:py-3 px-2.5 sm:px-3 md:px-3 hover:bg-beige-light rounded-lg text-left touch-target-min"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </nav>
  );
}

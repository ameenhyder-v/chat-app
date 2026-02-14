import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { LogOut, MessageSquare, Moon, Settings, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logOut, authUser } = useAuthStore();
  const { isDark, toggleLightDark } = useThemeStore();

  return (
    <header className="fixed w-full top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 h-14 sm:h-16">
            <div className="flex items-center justify-between h-full">
                <Link
                    to="/"
                    className="flex items-center gap-2.5 rounded-xl py-2 pr-3 -ml-2 transition-colors hover:bg-muted/60 active:scale-[0.98]"
                >
                    <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
                        <MessageSquare className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Chatty</h1>
                </Link>

                <nav className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={toggleLightDark}
                        className="btn btn-ghost btn-sm btn-circle text-muted-foreground hover:text-foreground hover:bg-accent"
                        aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
                        title={isDark() ? "Light mode" : "Dark mode"}
                    >
                        {isDark() ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <Link
                        to="/settings"
                        className="btn btn-ghost btn-sm gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </Link>

                    {authUser && (
                        <>
                            <Link
                                to="/profile"
                                className="btn btn-ghost btn-sm gap-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                            >
                                <User className="size-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                            <button
                                className="btn btn-ghost btn-sm gap-2 text-destructive hover:bg-destructive/10"
                                onClick={logOut}
                            >
                                <LogOut className="size-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </div>
    </header>
  );
};

export default Navbar;
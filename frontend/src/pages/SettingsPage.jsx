import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Moon, Send, Sun } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme, isDark, toggleLightDark } = useThemeStore();
  const dark = isDark();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 pb-12 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize your chat experience</p>
        </div>

        <section className="card rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-1">Appearance</h2>
          <p className="text-sm text-muted-foreground mb-4">Light or dark mode</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dark && toggleLightDark()}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                !dark
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-muted-foreground hover:border-border"
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="font-medium">Light</span>
            </button>
            <button
              type="button"
              onClick={() => !dark && toggleLightDark()}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                dark
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-muted-foreground hover:border-border"
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="font-medium">Dark</span>
            </button>
          </div>
        </section>

        <section className="card rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-1">Theme</h2>
          <p className="text-sm text-muted-foreground mb-4">Caffeine and Notebook themes from tweakcn</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {THEMES.map((t) => {
              const isSelected = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  className={`
                    group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all
                    ${isSelected ? "bg-primary/20 ring-2 ring-primary shadow-sm" : "hover:bg-muted"}
                  `}
                  onClick={() => setTheme(t)}
                  aria-pressed={isSelected}
                  aria-label={`Use ${t} theme`}
                >
                  <div className="relative h-8 w-full rounded-lg overflow-hidden ring-1 ring-border" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary" />
                      <div className="rounded bg-secondary" />
                      <div className="rounded bg-accent" />
                      <div className="rounded bg-muted" />
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium truncate w-full text-center ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                    {t.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-base font-semibold mb-3">Preview</h3>
          <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
            <div className="p-4 bg-muted/50">
              <div className="max-w-md mx-auto">
                <div className="bg-card rounded-xl overflow-hidden border border-border">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                        J
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">John Doe</h3>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 min-h-[180px] max-h-[180px] overflow-y-auto">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 ${
                            message.isSent ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-[10px] mt-1 ${message.isSent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border flex gap-2">
                    <input
                      type="text"
                      className="input flex-1 h-9 rounded-xl"
                      placeholder="Type a message..."
                      value=""
                      readOnly
                      disabled
                    />
                    <button className="btn btn-primary btn-sm btn-circle" disabled>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default SettingsPage;
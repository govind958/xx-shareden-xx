"use client";

import { useState } from "react";

export default function Page() {
  const [form, setForm] = useState({
    who: "",
    working: "",
    friction: "",
    extra: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    alert("Form submitted! Check console for data.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-background to-secondary/30">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 bg-card/80 backdrop-blur-xl text-card-foreground p-8 rounded-2xl shadow-xl border border-border"
      >
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🚀 Founder Form
        </h1>

        {/* Q1 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">🤔 Who are you & what are you building?</label>
          <input
            type="text"
            placeholder="Your answer"
            value={form.who}
            onChange={(e) => handleChange("who", e.target.value)}
            className="w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        {/* Q2 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">💡 One thing that’s working well in your startup?</label>
          <textarea
            placeholder="Your answer"
            value={form.working}
            onChange={(e) => handleChange("working", e.target.value)}
            className="w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
          />
        </div>

        {/* Q3 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">⚡ One thing that’s causing real friction in your startup?</label>
          <textarea
            placeholder="Your answer"
            value={form.friction}
            onChange={(e) => handleChange("friction", e.target.value)}
            className="w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-destructive focus:border-transparent transition"
          />
        </div>

        {/* Q4 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">
            🤝 One extra thing in your startup you can share with other founders?
            <span className="text-sm text-muted-foreground block">
              (Could be tools, talents, resources, space, etc.)
            </span>
          </label>
          <textarea
            placeholder="Your answer"
            value={form.extra}
            onChange={(e) => handleChange("extra", e.target.value)}
            className="w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-lg text-white shadow-md bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition"
        >
          Submit 🚀
        </button>
      </form>
    </main>
  );
}

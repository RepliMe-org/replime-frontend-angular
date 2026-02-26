/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "border-color": "rgb(var(--border-color-rgb))",
        "input-border-color": "rgb(var(--input-border-color-rgb))",
        "input-bg": "rgb(var(--input-bg-rgb))",
        "focus-ring": "rgb(var(--focus-ring-rgb))",
        "page-bg": "rgb(var(--page-bg-rgb))",
        "page-text": "rgb(var(--page-text-rgb))",
        "card-bg": "rgb(var(--card-bg-rgb))",
        "card-text": "rgb(var(--card-text-rgb))",
        "dropdown-bg": "rgb(var(--dropdown-bg-rgb))",
        "dropdown-text": "rgb(var(--dropdown-text-rgb))",
        cyan: "rgb(var(--cyan-rgb))",
        "cyan-text": "rgb(var(--cyan-text-rgb))",
        purple: "rgb(var(--purple-rgb))",
        "purple-text": "rgb(var(--purple-text-rgb))",
        danger: "rgb(var(--danger-rgb))",
        "danger-text": "rgb(var(--danger-text-rgb))",
        "subtle-bg": "rgb(var(--subtle-bg-rgb))",
        "subtle-text": "rgb(var(--subtle-text-rgb))",
        "sidebar-bg": "rgb(var(--sidebar-bg-rgb))",
        "sidebar-text": "rgb(var(--sidebar-text-rgb))",
        "sidebar-cyan": "rgb(var(--sidebar-cyan-rgb))",
        "sidebar-cyan-text": "rgb(var(--sidebar-cyan-text-rgb))",
        "sidebar-subtle-bg": "rgb(var(--sidebar-subtle-bg-rgb))",
        "sidebar-subtle-text": "rgb(var(--sidebar-subtle-text-rgb))",
        "sidebar-border": "rgb(var(--sidebar-border-rgb))",
        "sidebar-ring": "rgb(var(--sidebar-ring-rgb))",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

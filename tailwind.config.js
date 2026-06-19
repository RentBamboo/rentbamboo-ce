/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        zd: {
          teal: "#6b9e5a",
          "teal-light": "#7db86b",
          "teal-dim": "#c5dfb9",
          "teal-dark": "#3d6e2a",
          black: "#0a0a0a",
          "off-black": "#111111",
          dark: "#1a1a1a",
          mid: "#2c2c2c",
          white: "#fafaf8",
          surface: "#f4f3f0",
          "surface-2": "#eeecea",
          muted: "#7a766d",
          border: "#e0dcd3",
          "border-dark": "#3a3a34",
          ink: "#0a0a0a"
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem"
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        DEFAULT: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
        md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)"
      },
      animation: {
        "pulse-dot": "pulse 2s ease-in-out infinite",
        "spin-slow": "spin 0.7s linear infinite"
      }
    }
  },
  plugins: []
}

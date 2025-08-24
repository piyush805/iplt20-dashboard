/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // IPL Vista Design System Colors
        primary: "hsl(var(--primary))",
        "primary-glow": "hsl(var(--primary-glow))",
        secondary: "hsl(var(--secondary))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        // Status Colors
        live: "hsl(var(--live))",
        upcoming: "hsl(var(--upcoming))",
        completed: "hsl(var(--completed))",
      },

      // Typography Hierarchy
      fontSize: {
        hero: ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        "hero-sm": ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
      },

      // Spacing System
      maxWidth: {
        container: "1280px", // 7xl equivalent
      },

      // Animation System
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      // Box Shadows
      boxShadow: {
        card: "var(--shadow-card)",
        elegant: "var(--shadow-elegant)",
        glow: "var(--shadow-glow)",
      },

      // Border Radius
      borderRadius: {
        card: "0.75rem",
      },

      // Background Images (Gradients)
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
      },

      // Transitions
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // Extended spacing for better design system
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },

      // Extended z-index for proper layering
      zIndex: {
        60: "60",
        70: "70",
      },
    },
  },
  plugins: [
    // Custom plugin for IPL-specific utilities
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".bg-gradient-primary": {
          background: "var(--gradient-primary)",
        },
        ".bg-gradient-hero": {
          background: "var(--gradient-hero)",
        },
        ".bg-gradient-card": {
          background: "var(--gradient-card)",
        },
        ".shadow-card": {
          boxShadow: "var(--shadow-card)",
        },
        ".shadow-elegant": {
          boxShadow: "var(--shadow-elegant)",
        },
        ".shadow-glow": {
          boxShadow: "var(--shadow-glow)",
        },
        ".border-border": {
          borderColor: "hsl(var(--border))",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

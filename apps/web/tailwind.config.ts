import type { Config } from "tailwindcss";

const config = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx}"],
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
        // Cores do sistema shadcn/ui (baseadas em CSS variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
          accent: "hsl(var(--primary-accent))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          brown: "hsl(var(--accent-brown))",
          blue: "hsl(var(--accent-blue))",
          pink: "hsl(var(--accent-pink))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cores customizadas do FinanPsi
        finansi: {
          // Cores de texto
          "text-primary": "hsl(var(--text-primary))",
          "text-secondary": "hsl(var(--text-secondary))",
          "text-tertiary": "hsl(var(--text-tertiary))",
          // Cores de background
          "bg-dark": "hsl(var(--background-dark))",
          "bg-light": "hsl(var(--background-light))",
          // Cores de estado
          success: "hsl(var(--success))",
          warning: "hsl(var(--warning))",
          info: "hsl(var(--info))",
          // Cores de badge
          "badge-launch": "hsl(var(--badge-launch))",
          "badge-launch-text": "hsl(var(--badge-launch-text))",
          "badge-info-bg": "hsl(var(--badge-info-bg))",
          "badge-info-text": "hsl(var(--badge-info-text))",
          // Cores do footer
          "footer-bg": "hsl(var(--footer-bg))",
          "footer-text": "hsl(var(--footer-text))",
          "footer-border": "hsl(var(--footer-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tamanhos de fonte customizados seguindo a escala tipográfica
        display: [
          "3.75rem",
          { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" },
        ], // 60px
        h1: [
          "3rem",
          { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" },
        ], // 48px
        h2: ["2.25rem", { lineHeight: "1.3", fontWeight: "700" }], // 36px
        h3: ["1.875rem", { lineHeight: "1.4", fontWeight: "600" }], // 30px
        h4: ["1.5rem", { lineHeight: "1.5", fontWeight: "600" }], // 24px
        h5: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }], // 20px
        h6: ["1.125rem", { lineHeight: "1.5", fontWeight: "600" }], // 18px
        "body-lg": ["1.125rem", { lineHeight: "1.75", fontWeight: "400" }], // 18px
        body: ["1rem", { lineHeight: "1.75", fontWeight: "400" }], // 16px
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }], // 14px
        caption: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }], // 12px
      },
      spacing: {
        // Espaçamentos customizados se necessário
        "18": "4.5rem",
        "88": "22rem",
      },
      boxShadow: {
        finansi:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "finansi-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "finansi-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
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
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				gadies: {
					orange: "#FF6B35",
					red: "#DC2626",
					blue: "#2563EB",
					green: "#16A34A",
					yellow: "#EAB308",
					gray: {
						50: "#F8FAFC",
						100: "#F1F5F9",
						200: "#E2E8F0",
						300: "#CBD5E1",
						400: "#94A3B8",
						500: "#64748B",
						600: "#475569",
						700: "#334155",
						800: "#1E293B",
						900: "#0F172A",
					},
				},
				status: {
					normal: "#16A34A",
					warning: "#EAB308",
					danger: "#DC2626",
					info: "#2563EB",
				},
				dashboard: {
					bg: "#0F172A",
					card: "#1E293B",
					accent: "#FF6B35",
					text: "#F8FAFC",
					muted: "#64748B",
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				danger: {
					DEFAULT: 'hsl(var(--danger))',
					foreground: 'hsl(var(--danger-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 10px hsl(var(--primary) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 30px hsl(var(--primary) / 0.4)'
					}
				},
				'turbo-spin': {
					from: {
						transform: 'rotate(0deg)'
					},
					to: {
						transform: 'rotate(360deg)'
					}
				},
				'data-flow': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'turbo-spin': 'turbo-spin 8s linear infinite',
				'data-flow': 'data-flow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-turbo': 'var(--gradient-turbo)',
				'gradient-engine': 'var(--gradient-engine)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'elevated': 'var(--shadow-elevated)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

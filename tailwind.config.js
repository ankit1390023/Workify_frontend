/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{ts,tsx,js,jsx}",
	],
	theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		animation: {
    			'spin-slower': 'spin 3s linear infinite',
    			'fade-in': 'fade-in 0.5s ease-in-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		keyframes: {
    			shine: {
    				'0%': {
    					'background-position': '100%'
    				},
    				'100%': {
    					'background-position': '-100%'
    				}
    			},
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
    			}
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))'
    			},
    			jobOrange: '#f97316',
    			jobBlue: '#3b82f6',
    			jobTeal: '#14b8a6'
    		},
    		spacing: {
    			'18': '4.5rem',
    			'22': '5.5rem'
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
    				'sans-serif'
    			],
    			mono: [
    				'Fira Code',
    				'monospace'
    			]
    		}
    	}
    },
	plugins: [
	  // Add any necessary plugins here
	],
  };
  
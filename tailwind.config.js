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
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
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
    		},
    		animation: {
    			fadeIn: 'fadeIn 0.5s ease-in-out',
    			slideIn: 'slideIn 0.5s ease-in-out',
    			moveLogos: 'moveLogos 15s linear infinite',
    			hoverZigzag: 'hoverZigzag 2s ease-in-out infinite',
    			'spin-slow': 'spin 10s linear infinite',
    			bounceSlow: 'bounceSlow 3s ease-in-out infinite',
    			pulseSlow: 'pulseSlow 3s infinite',
    			'scale-3d': 'scale3d 0.8s ease-in-out infinite',
    			'rotate-3d': 'rotate3d 10s linear infinite',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		keyframes: {
    			fadeIn: {
    				'0%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			slideIn: {
    				'0%': {
    					transform: 'translateX(-100%)'
    				},
    				'100%': {
    					transform: 'translateX(0)'
    				}
    			},
    			moveLogos: {
    				'0%': {
    					transform: 'translateX(100%)'
    				},
    				'100%': {
    					transform: 'translateX(-100%)'
    				}
    			},
    			hoverZigzag: {
    				'0%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'20%': {
    					transform: 'translateY(-10px)'
    				},
    				'40%': {
    					transform: 'translateY(10px)'
    				},
    				'60%': {
    					transform: 'translateY(-10px)'
    				},
    				'80%': {
    					transform: 'translateY(10px)'
    				}
    			},
    			bounceSlow: {
    				'0%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-15px)'
    				}
    			},
    			pulseSlow: {
    				'0%': {
    					opacity: 1
    				},
    				'50%': {
    					opacity: 0.7
    				},
    				'100%': {
    					opacity: 1
    				}
    			},
    			scale3d: {
    				'0%': {
    					transform: 'scale(1)'
    				},
    				'50%': {
    					transform: 'scale(1.05)'
    				},
    				'100%': {
    					transform: 'scale(1)'
    				}
    			},
    			rotate3d: {
    				'0%': {
    					transform: 'rotateY(0deg)'
    				},
    				'100%': {
    					transform: 'rotateY(360deg)'
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
    		}
    	}
    },
	plugins: [
	  // Add any necessary plugins here
	],
  };
  
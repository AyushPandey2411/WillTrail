export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#94a3b8',400:'#64748b',
                   500:'#475569',600:'#334155',700:'#1e293b',800:'#0f172a',900:'#020617' },
        teal:    { DEFAULT:'#0d9488', light:'#14b8a6', dark:'#0f766e', 50:'#f0fdfa' },
        crimson: { DEFAULT:'#dc2626', light:'#ef4444' },
        amber:   { DEFAULT:'#d97706', light:'#f59e0b' },
        emerald: { DEFAULT:'#059669', light:'#10b981' },
      },
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        body:    ["'DM Sans'", 'system-ui', 'sans-serif'],
        mono:    ["'JetBrains Mono'", 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'slide-in-r': 'slideInRight 0.4s ease forwards',
        'count-up':   'fadeIn 1s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:       { from:{ opacity:0 },                               to:{ opacity:1 } },
        slideUp:      { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        slideInRight: { from:{ opacity:0, transform:'translateX(20px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        float:        { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};

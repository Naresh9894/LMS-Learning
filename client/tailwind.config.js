/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize :{
        'course-details-heading-small' :['26px','36px'],
        'course-details-heading-large' :['36px','44px'],
        'home-heading-small' :['28px','34px'],
        'home-heading-large' :['48px','56px'],
        'default':['15px','21px']
      },
      gridTemplateColumns:{
        'auto' : 'repeat(auto-fit, minmax(200px,1fr))'
      },
      spacing: {
      'section-height' : '500px',
    },
    maxWidth: {
      'course-card': '424px'
    },
    boxShadow: {
      'custom-card':'0 4px 15px 2px rgba(0,0,0,0.1)',
      'input': [
        "0px 2px 3px -1px rgba(0, 0, 0, 0.2)",
        "0px 1px 0px 0px rgba(25, 28, 33, 0.04)",
        "0px 0px 0px 1px rgba(25, 28, 33, 0.12)",
      ].join(", "),
    },
    animation: {
      ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
      orbit: "orbit calc(var(--duration) * 1s) linear infinite",
    },
    keyframes: {
      ripple: {
        "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
        "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
      },
      orbit: {
        "0%": {
          transform:
            "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
        },
        "100%": {
          transform:
            "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
        },
      },
    },
  },
  plugins: [],
}
}

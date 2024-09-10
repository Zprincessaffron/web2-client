/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #8ebfbe 0%, #8ebfbe 100%)',
        // 'linear-gradient(to right, #00477d 0%, #00477d 100%)',
        'custom-gradient-2': 'linear-gradient(to right, #6d30a7 0%, #6d30a7 100%)',
        'custom-gradient-3':  'linear-gradient(to right, #8157c9 0%, #8157c9 100%)',
        // 'linear-gradient(to right, #f69858 0%, #f69858 100%)',
        // 'linear-gradient(to right, #aacbca 0%, #aacbca 100%)',
        // 'linear-gradient(to right, #e64851 0%, #e64851 100%)',
        // FF5349
        'custom-gradient-4': 'linear-gradient(to right, #be95be 0%, #be95be 100%)',
        'custom-gradient-5': 'linear-gradient(to right, #547654 0%, #547654 100%)',
        'custom-gradient-6': 'linear-gradient(to right, #b9a15a 0%, #b9a15a 100%)',
        // 'custom-gradient-7': 'linear-gradient(to right, #281332 0%, #281332 100%)',
        'custom-gradient-7': 'linear-gradient(to right, #8932b3 0%, #8932b3 100%)',
        
        'custom-gradient-8': 'linear-gradient(to right, #7da4c5 0%, #7da4c5 100%)',
        'custom-gradient-9': 'linear-gradient(to right, #9e826c 0%, #9e826c 100%)',
        'custom-gradient-10': 'linear-gradient(to right, #75ba75 0%, #75ba75 100%)',
        'custom-gradient-11': 'linear-gradient(to right, #320466 0%, #320466 100%)',
        'custom-gradient-12': 'linear-gradient(to right, #8cb09c 0%, #8cb09c 100%)',
        'custom-gradient-13': 'linear-gradient(to right, #fd022f 0%, #fd022f 100%)',
        'custom-gradient-14': 'linear-gradient(to right, #be95be 0%, #be95be 100%)',
      },
      colors: {
        'scroll-thumb': '#FFFFFFCC', // White with some transparency for the scrollbar thumb
        'scroll-track': '#FFFFFF1A', // Slightly transparent white for the scrollbar track
        'saffron': '#FF9933',
        'darkSaffron': '#CC7722',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  variants: {
    scrollbar: ['rounded'], // optional, to enable rounded scrollbars
  },
}
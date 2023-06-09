/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    minHeight: {
      '25': '25vh',
      '50': '50vh',
      '75': '75vh',
      '85': '85vh',
    },
    minWidth: {
      "32" : "32px",
      "56" : "56px"
    },
    extend: {
      backgroundImage: theme => ({
        'gradient-slate': 'linear-gradient(#1F0F53, #000017 )',
      }),
      blur: {
        xs: '3px',
      },
      colors: {
        'white': {
          DEFAULT: '#ffffff',
          '50': '#ffffff',
          '100': '#f2f2f2',
          '200': '#d9d9d9',
          '300': '#b8b8b8',
          '400': '#989898',
          '500': '#787878',
          '600': '#5a5a5a',
          '700': '#3c3c3c',
          '800': '#1f1f1f',
          '900': '#020202',
        },
        'slate': {
          DEFAULT: '#251d36',
          '50': '#F2F2F7',  
          '100': '#D9D9E0', 
          '200': '#B8B8C7', 
          '300': '#9898AF', 
          '400': '#787896', 
          '500': '#5A5A7C', 
          '600': '#3C3C63', 
          '700': '#1F1F49', 
          '800': '#020230', 
          '900': '#000017', 
        },
        'red': {
          DEFAULT: '#FF6A3D',
          '50': '#FFE8E1',
          '100': '#FFD1C4',
          '200': '#FFBAA8',
          '300': '#FFA38B',
          '400': '#FF8C6E',
          '500': '#FF6A3D',
          '600': '#CC5531',
          '700': '#994025',
          '800': '#662B19',
          '900': '#33160D',
        },
        'cyan': {
          DEFAULT: '#9DAAF2',
          '50': '#FFFFFF',  
          '100': '#F2F5FD', 
          '200': '#D5DCF7', 
          '300': '#B8C4F2', 
          '400': '#9DAAF2', 
          '500': '#7F91ED', 
          '600': '#6278E8', 
          '700': '#445FDC', 
          '800': '#2647D1', 
          '900': '#0830C5', 
        },
        'yellow': {
          DEFAULT: '#ffdc00',
          '50': '#FFFFFF',  
          '100': '#FEF9F2', 
          '200': '#FDF2D5', 
          '300': '#FBECB8', 
          '400': '#F9E59D', 
          '500': '#ffdc00', 
          '600': '#F0D162', 
          '700': '#EBC847', 
          '800': '#E6BF2C', 
          '900': '#E1B511', 
        },
        'orange': {
          DEFAULT: '#d05325',
          '50': '#FFFFFF',  
          '100': '#FEF2F2', 
          '200': '#FBD5D5', 
          '300': '#F8B8B8', 
          '400': '#F59D9D', 
          '500': '#F17E7E', 
          '600': '#ED6262', 
          '700': '#E94545', 
          '800': '#E52929', 
          '900': '#E10C0C', 
        },
        'violet': {
          DEFAULT: '#6d71cf',
          '50': '#FFFFFF',  
          '100': '#F5F5FD', 
          '200': '#DCDCF7', 
          '300': '#C4C4F2', 
          '400': '#AEAEEC', 
          '500': '#9999E7', 
          '600': '#8383E2', 
          '700': '#6D6DDC', 
          '800': '#5858D7', 
          '900': '#4242D1', 
        }
      },

    }
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      opacity: ['disabled']
    },
  },
  plugins: [],
}
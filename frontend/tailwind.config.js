/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'lora': ['Lora', 'serif'],
        'inter': ["Inter"]
      },
      colors: {
        'new': '#FF6347'
      }
    },
  },
  plugins: [],
}


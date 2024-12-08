import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      backgroundColor: {
        'pink': "#ffc0cb",
      },
      colors: {
        'blue': "#233291",
      },
      borderWidth: {
        '1': "1px"
      },
      scale: {
        '500%': "500%"
      },
      inset: {
        'h/6': "calc(100vh / 6)",
        '1/5': "20%",
        '2/5': "40%",
      },
      height: {
        'w': "w-full"
      }
    }
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;

import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#F1D9A1',
    },
    secondary: {
      main: '#856723',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: '#636363',
      secondary: '#8f8f8f',
    },
  },
})

export default theme

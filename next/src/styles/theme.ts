import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#A19617',
    },
    secondary: {
      main: '#EBE59D',
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

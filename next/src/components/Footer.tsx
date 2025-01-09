import { Box, Container, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f1d9a1',
        py: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} HoMee.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer

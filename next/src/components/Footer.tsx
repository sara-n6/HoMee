import { Box, Container, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '##FFFCCC',
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

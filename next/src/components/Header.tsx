import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import TaskIcon from '@mui/icons-material/Task'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@mui/material'
import axios, { AxiosResponse, AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useUserState } from '@/hooks/useGlobalState'

const Header = () => {
  const [user] = useUserState()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const addNewTask = () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks'

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    axios({ method: 'POST', url: url, headers: headers })
      .then((res: AxiosResponse) => {
        router.push('/current/tasks/edit/' + res.data.id)
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message)
      })
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        py: 1,
      }}
    >
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Link href="/">
              <Image src="/logohomee.png" width={133} height={40} alt="logo" />
            </Link>
          </Box>
          {user.isFetched && (
            <>
              {!user.isSignedIn && (
                <Box>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontSize: 16,
                      borderRadius: 2,
                      boxShadow: 'none',
                    }}
                    onClick={() => {
                      router.push('/sign_in')
                    }}
                  >
                    ログイン
                  </Button>
                  <Link href="/sign_up">
                    <Button
                      color="primary"
                      variant="outlined"
                      sx={{
                        textTransform: 'none',
                        fontSize: 16,
                        lineHeight: '27px',
                        borderRadius: 2,
                        boxShadow: 'none',
                        border: '1.5px solid #3EA8FF',
                        ml: 2,
                      }}
                    >
                      会員登録
                    </Button>
                  </Link>
                </Box>
              )}
              {user.isSignedIn && (
                <Box sx={{ display: 'flex' }}>
                  <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </IconButton>
                  <Box sx={{ ml: 2 }}>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontSize: 16,
                        borderRadius: 2,
                        width: 100,
                        boxShadow: 'none',
                      }}
                      onClick={addNewTask}
                    >
                      新規作成
                    </Button>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                  >
                    <Box sx={{ pl: 2, py: 1 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {user.name}
                      </Typography>
                    </Box>
                    <Divider />
                    <Link href="/current/tasks">
                      <MenuItem>
                        <ListItemIcon>
                          <TaskIcon fontSize="small" />
                        </ListItemIcon>
                        タスクの管理
                      </MenuItem>
                    </Link>
                    <Link href="/sign_out">
                      <MenuItem>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        ログアウト
                      </MenuItem>
                    </Link>
                  </Menu>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header

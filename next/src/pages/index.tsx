import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
  Modal,
} from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState } from '@/hooks/useGlobalState'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type TaskProps = {
  id: number
  title: string
  status: string
}

const Index: NextPage = () => {
  const [user] = useUserState()
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks'

  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)
  const [open, setOpen] = useState(false)

  if (error) return <Error />
  if (!user.isFetched || (user.isSignedIn && !data)) return <Loading />

  const tasks: TaskProps[] = data ? camelcaseKeys(data) : []
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box css={styles.pageMinHeight}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        {user.isFetched && (
          <>
            {data && (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    component="h2"
                    sx={{ fontSize: 32, fontWeight: 'bold' }}
                  >
                    タスク一覧
                  </Typography>
                </Box>
                {tasks.map((task: TaskProps) => (
                  <Box key={task.id} sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minHeight: 80,
                      }}
                    >
                      <Box sx={{ width: 'auto', pr: 3 }}>
                        <Typography
                          component="h3"
                          sx={{
                            fontSize: { xs: 16, sm: 18 },
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          {task.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          minWidth: 180,
                          width: 180,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        {task.status === '下書き' && (
                          <Box
                            sx={{
                              display: 'inline',
                              fontSize: 12,
                              textAlign: 'center',
                              border: '1px solid #9FAFBA',
                              p: '4px',
                              borderRadius: 1,
                              color: '#9FAFBA',
                              fontWeight: 'bold',
                            }}
                          >
                            {task.status}
                          </Box>
                        )}
                        {task.status === '公開中' && (
                          <Box
                            sx={{
                              display: 'inline',
                              fontSize: 12,
                              textAlign: 'center',
                              border: '1px solid #f1d9a1',
                              p: '4px',
                              borderRadius: 1,
                              color: '#f1d9a1',
                              fontWeight: 'bold',
                            }}
                          >
                            {task.status}
                          </Box>
                        )}
                        <Box>
                          <Link href={'/current/tasks/edit/' + task.id}>
                            <Avatar>
                              <Tooltip title="編集する">
                                <IconButton sx={{ backgroundColor: '#F1F5FA' }}>
                                  <EditIcon sx={{ color: '#99AAB6' }} />
                                </IconButton>
                              </Tooltip>
                            </Avatar>
                          </Link>
                        </Box>
                        <Box>
                          <Link href={'/current/tasks/' + task.id}>
                            <Avatar>
                              <Tooltip title="表示を確認">
                                <IconButton sx={{ backgroundColor: '#F1F5FA' }}>
                                  <ChevronRightIcon sx={{ color: '#99AAB6' }} />
                                </IconButton>
                              </Tooltip>
                            </Avatar>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      console.log('タスクを完了しました！')
                      handleOpen()
                    }}
                    sx={{ textTransform: 'none', px: 3 }}
                  >
                    完了
                  </Button>
                </Box>
                <Modal open={open} onClose={handleClose}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'white',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src="/completion.png"
                      alt="タスク完了"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        marginBottom: '16px',
                      }}
                    />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      すごいにゃ！この調子でいくにゃ！頭撫ででいいにゃよ
                    </Typography>
                    <Button variant="outlined" onClick={handleClose}>
                      とじる
                    </Button>
                  </Box>
                </Modal>
              </>
            )}
          </>
        )}
        {!user.isSignedIn && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '100vh', // 画面全体で中央揃え
              px: 2,
            }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: 36, fontWeight: 'bold', mb: 3 }}
            >
              HoMeeとは
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: 18, lineHeight: 1.6, mb: 4 }}
            >
              とってもゆるいタスク管理アプリです。
              <br />
              タスクを終えるたびに、
              <br />
              あなただけのメッセージが届きます◎
              <br />
              <br />
              さっそく始めて、
              <br />
              褒められ上手になっちゃいましょう！
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Index

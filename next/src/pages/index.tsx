import { Box, Grid, Container, Pagination, Typography } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import TaskCard from '@/components/TaskCard'
import { useUserState } from '@/hooks/useGlobalState'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type TaskProps = {
  id: number
  title: string
  createdAt: string
  fromToday: string
  user: {
    name: string
  }
}

const Index: NextPage = () => {
  const [user] = useUserState()
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/tasks/?page=' + page

  const { data, error } = useSWR(url, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const tasks = camelcaseKeys(data.tasks)
  const meta = camelcaseKeys(data.meta)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push('/?page=' + value)
  }

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#e6f2ff' }}>
      {user.isFetched && (
        <>
          {user.isSignedIn && (
            <Container maxWidth="md" sx={{ pt: 6 }}>
              <Grid container spacing={4}>
                {tasks.map((task: TaskProps, i: number) => (
                  <Grid key={i} item xs={12} md={6}>
                    <Link href={'/tasks/' + task.id}>
                      <TaskCard
                        title={task.title}
                        fromToday={task.fromToday}
                        userName={task.user.name}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Pagination
                  count={meta.totalPages}
                  page={meta.currentPage}
                  onChange={handleChange}
                />
              </Box>
            </Container>
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
    </Box>
  )
}

export default Index

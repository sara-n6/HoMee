import { Box, Grid, Container } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import TaskCard from '@/components/TaskCard'
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
  const url = 'http://localhost:3000/api/v1/tasks'

  const { data, error } = useSWR(url, fetcher)
  if (error) return <div>An error has occurred.</div>
  if (!data) return <div>Loading...</div>

  const tasks = camelcaseKeys(data.tasks)

  return (
    <Box sx={{ backgroundColor: '#e6f2ff', minHeight: '100vh' }}>
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
      </Container>
    </Box>
  )
}

export default Index

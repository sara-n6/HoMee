import { Button, Box, Container, TextField, Typography } from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import snakecaseKeys from 'snakecase-keys'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn'
import { fetcher } from '@/utils'

type TaskProps = {
  title: string
  body: string
  status: string
  endDate: string
}

type TaskFormData = {
  title: string
  body: string
  endDate: string
}

const CurrentTasksEdit: NextPage = () => {
  useRequireSignedIn()
  const router = useRouter()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks/'
  const { id } = router.query
  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  )

  const task: TaskProps = useMemo(() => {
    if (!data) {
      return {
        title: '',
        body: '',
        status: '',
        endDate: '',
      }
    }
    return {
      title: data.title == null ? '' : data.title,
      body: data.body == null ? '' : data.body,
      status: data.status,
      endDate:
        data.end_date == '----:--:--'
          ? ''
          : new Intl.DateTimeFormat('ja', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
              .format(new Date(data.end_date))
              .replace(/\//g, '-'),
    }
  }, [data])

  const { handleSubmit, control, reset } = useForm<TaskFormData>({
    defaultValues: task,
  })

  useEffect(() => {
    if (data) {
      reset(task)
      setIsFetched(true)
    }
  }, [data, task, reset])

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    if (data.title == '') {
      return setSnackbar({
        message: 'タスクの保存にはタイトルが必要です',
        severity: 'error',
        pathname: '/current/tasks/edit/[id]',
      })
    }

    if (data.body == '') {
      return setSnackbar({
        message: '本文なしのタスクは保存できません',
        severity: 'error',
        pathname: '/current/tasks/edit/[id]',
      })
    }

    setIsLoading(true)

    const patchUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks/' + id

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const patchData = { ...data, status: 'saved' }

    axios({
      method: id ? 'PATCH' : 'POST',
      url: patchUrl,
      data: snakecaseKeys(patchData),
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: id ? 'タスクを更新しました' : 'タスクを作成しました',
          severity: 'success',
          pathname: '/',
        })
        router.push('/')
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: id
            ? `
          タスクの更新に失敗しました
        `
            : 'タスクの作成に失敗しました',
          severity: 'error',
          pathname: '/current/tasks/edit/[id]',
        })
      })
    setIsLoading(false)
  }

  if (error) return <Error />
  if (!data || !isFetched) return <Loading />

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ minHeight: '100vh' }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: 11, pb: 3, display: 'flex', justifyContent: 'center' }}
      >
        <Box sx={{ width: 840 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 16, sm: 16 },
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 1,
            }}
          >
            --- タスク{task.status == '未保存' ? '登録' : '編集'} ---
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 'normal',
              color: 'text.primary',
              mb: 1,
              paddingLeft: 2,
            }}
          >
            タイトル
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 'normal',
              color: 'text.primary',
              mb: 1,
              paddingLeft: 2,
            }}
          >
            タスク内容
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="body"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="textarea"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  multiline
                  fullWidth
                  rows={10}
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: 'normal',
              color: 'text.primary',
              mb: 1,
              paddingLeft: 2,
            }}
          >
            期限
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  placeholder="yyyy/mm/dd"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit(onSubmit)()
              }}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: 12, sm: 16 },
                mt: 1,
              }}
            >
              {isLoading
                ? '処理中...'
                : task.status == '未保存'
                  ? '作成'
                  : '更新'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default CurrentTasksEdit

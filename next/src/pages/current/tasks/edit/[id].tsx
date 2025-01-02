import {
  Button,
  Box,
  Card,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import MarkdownText from '@/components/MarkdownText'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn'
import { fetcher } from '@/utils'

type TaskProps = {
  title: string
  body: string
  status: string
}

type TaskFormData = {
  title: string
  body: string
}

const CurrentTasksEdit: NextPage = () => {
  useRequireSignedIn()
  const router = useRouter()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const [previewChecked, setPreviewChecked] = useState<boolean>(false)
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)

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
        status: false,
      }
    }
    return {
      title: data.title == null ? '' : data.title,
      body: data.body == null ? '' : data.body,
      status: data.status,
    }
  }, [data])

  const { handleSubmit, control, reset, watch } = useForm<TaskFormData>({
    defaultValues: task,
  })

  useEffect(() => {
    if (data) {
      reset(task)
      setStatusChecked(task.status == '公開中')
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

    if (statusChecked && data.body == '') {
      return setSnackbar({
        message: '本文なしのタスクは公開はできません',
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

    const status = statusChecked ? 'published' : 'draft'

    const patchData = { ...data, status: status }

    axios({
      method: 'PATCH',
      url: patchUrl,
      data: patchData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: 'タスクを保存しました',
          severity: 'success',
          pathname: '/current/tasks/edit/[id]',
        })
        router.push('/')
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: 'タスクの保存に失敗しました',
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
      sx={{ backgroundColor: '#EDF2F7', minHeight: '100vh' }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: 11, pb: 3, display: 'flex', justifyContent: 'center' }}
      >
        {!previewChecked && (
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
              --- タスク登録 ---
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
                name="end_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="text"
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
                作成
              </Button>
            </Box>
          </Box>
        )}
        {previewChecked && (
          <Box sx={{ width: 840 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 21, sm: 25 },
                fontWeight: 'bold',
                textAlign: 'center',
                pt: 2,
                pb: 4,
              }}
            >
              {watch('title')}
            </Typography>
            <Card sx={{ boxShadow: 'none', borderRadius: '12px' }}>
              <Box
                sx={{
                  padding: { xs: '0 24px 24px 24px', sm: '0 40px 40px 40px' },
                  marginTop: { xs: '24px', sm: '40px' },
                }}
              >
                <MarkdownText content={watch('content')} />
              </Box>
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default CurrentTasksEdit

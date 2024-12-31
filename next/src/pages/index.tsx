import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import axios, { AxiosError } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState, useSnackbarState } from '@/hooks/useGlobalState'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type TaskProps = {
  id: number
  title: string
  body: string
  status: string
  end_date: string
}

const Index: NextPage = () => {
  const [, setSnackbar] = useSnackbarState()
  const [user] = useUserState()
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [tasks, setTasks] = useState<TaskProps[]>([])

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks?state=in_progress'

  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  useEffect(() => {
    if (data) {
      setTasks(camelcaseKeys(data))
    }
  }, [data])

  const columns: ColumnDef<TaskProps>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          //現在のページの全ての行が選択されているかどうか
          checked={table.getIsAllRowsSelected()}
          //全ての行のチェックボックスを切り替えるために使用するハンドラーを返す
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          //行が選択されているかどうか
          checked={row.getIsSelected()} //未実施の場合は非活性
          //チェックボックスを切り替えるために使用するハンドラーを返す
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      id: 'title',
      header: 'タイトル',
      accessorKey: 'title',
    },
    {
      id: 'body',
      header: 'タスク内容',
      accessorKey: 'body',
    },
    {
      id: 'endDate',
      header: '期限',
      accessorKey: 'endDate',
    },
    {
      id: 'edit',
      cell: ({ row }) => {
        return (
          <Link href={'/current/tasks/edit/' + row.original.id}>
            <Tooltip title="編集する">
              <IconButton>
                <Image src="/edit.svg" width={30} height={30} alt="edit" />
              </IconButton>
            </Tooltip>
          </Link>
        )
      },
    },
    {
      id: 'delete',
      cell: ({ row }) => {
        return (
          <Tooltip title="削除する">
            <IconButton onClick={() => handleDelete(row.original.id)}>
              <Image src="/delete.svg" width={30} height={30} alt="delete" />
            </IconButton>
          </Tooltip>
        )
      },
    },
  ]

  const table = useReactTable<TaskProps>({
    data: tasks || [],
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  if (error) return <Error />
  if (!user.isFetched || (user.isSignedIn && !data)) return <Loading />

  const isSelected =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()

  const handleComplete = () => {
    const completeUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks/batch_complete'
    const ids = table.getSelectedRowModel().rows.map((row) => row.original.id)

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    axios({
      method: 'PATCH',
      url: completeUrl,
      data: { task_ids: ids },
      headers: headers,
    })
      .then(() => {
        const inProgressTasks = tasks.filter((task) => !ids.includes(task.id))
        setTasks(inProgressTasks)
        table.resetRowSelection()
        handleOpen()
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: 'タスクの完了に失敗しました',
          severity: 'error',
          pathname: '/',
        })
      })
  }

  const handleDelete = (id: number) => {
    const deleteUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + '/current/tasks/' + id

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    axios({
      method: 'DELETE',
      url: deleteUrl,
      headers: headers,
    })
      .then(() => {
        const inProgressTasks = tasks.filter((task) => id != task.id)
        setTasks(inProgressTasks)
        table.resetRowSelection()
        setSnackbar({
          message: 'タスクを削除しました',
          severity: 'success',
          pathname: '/',
        })
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: 'タスクの削除に失敗しました',
          severity: 'error',
          pathname: '/',
        })
      })
  }

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
                <Box sx={{ textAlign: 'center' }}>
                  <Typography component="h2" sx={{ fontSize: 16 }}>
                    --- タスク一覧 ---
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Image src="/task.svg" width={300} height={300} alt="task" />
                  <Typography sx={{ fontSize: 14 }}>
                    タスクを完了したら☑︎をおしてください
                  </Typography>
                </Box>
                <Table sx={{ mb: 4 }}>
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableCell key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody>
                    {table.getCoreRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Button
                    color="secondary"
                    disabled={!isSelected}
                    variant="contained"
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontSize: 16,
                      borderRadius: 2,
                      width: 100,
                      boxShadow: 'none',
                    }}
                    onClick={handleComplete}
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

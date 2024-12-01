import type { NextPage } from 'next'
import SimpleButton from '@/components/SimpleButton'

const HoMee: NextPage = () => {
  const handleOnClick = () => {
    console.log('Clicked from hello_world')
  }

  return (
    <>
      <h1>HoMee</h1>
      <p>タスク管理アプリです</p>
      <SimpleButton text={'はじめる'} onClick={handleOnClick} />
    </>
  )
}

export default HoMee

import dayjs from 'dayjs'
import { CapitalizeString } from '@/base_submod/utils/Strings'

interface TitleWithDateProps {
  title: string | undefined
  date: Date | string | undefined
}

function TitleWithDate({ title, date }: TitleWithDateProps) {
  return (
    <div>
      <p className=":uno: font-medium">{CapitalizeString(title)}</p>
      <p className=":uno: text-sm text-gray-500">{dayjs(date).format('MMM D, YYYY')}</p>
    </div>
  )
}

export default TitleWithDate

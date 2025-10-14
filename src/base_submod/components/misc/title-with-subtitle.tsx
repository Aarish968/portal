import { CapitalizeString } from '@/base_submod/utils/Strings'

interface TitleWithSubtitleProps {
  title: string | undefined
  subtitle: string
}

function TitleWithSubtitle({ title, subtitle }: TitleWithSubtitleProps) {
  return (
    <div>
      <p className=":uno: font-medium">{CapitalizeString(title)}</p>
      <p className=":uno: text-sm text-gray-500">{CapitalizeString(subtitle)}</p>
    </div>
  )
}

export default TitleWithSubtitle

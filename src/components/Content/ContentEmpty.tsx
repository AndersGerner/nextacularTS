import { ReactNode } from 'react'

type ContentEmptyProps = {
  children: ReactNode
}

const ContentEmpty: React.FC<ContentEmptyProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-5 bg-gray-100 border border-dashed rounded dark:bg-zinc-900">
        <p>{children}</p>
      </div>
    </div>
  )
}

export default ContentEmpty

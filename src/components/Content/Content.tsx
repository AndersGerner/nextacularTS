import { ReactNode } from 'react'

type ContentProps = {
  children: ReactNode
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full p-5 space-y-5 overflow-y-auto pt-0 md:px-10 md:w-full">
      {children}
    </div>
  )
}

export default Content

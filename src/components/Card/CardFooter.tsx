import { ReactNode } from 'react'

type CardFooterProps = {
  children?: ReactNode
}

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-2 space-x-5 bg-gray-100 border-t rounded-b dark:bg-zinc-900 dark:border-t-zinc-800">
      {children}
    </div>
  )
}

export default CardFooter

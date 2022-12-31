import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  danger?: boolean
}

const Card: React.FC<CardProps> = ({ children, danger }) => {
  return danger ? (
    <div className="flex flex-col justify-between border-2 border-red-600 rounded">
      {children}
    </div>
  ) : (
    <div className="flex flex-col justify-between border rounded dark:border-zinc-800">
      {children}
    </div>
  )
}

export default Card

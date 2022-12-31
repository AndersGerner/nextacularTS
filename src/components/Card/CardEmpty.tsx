import { ReactNode } from 'react'

type CardEmptyProps = {
  children: ReactNode
}

const CardEmpty: React.FC<CardEmptyProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center text-sm p-5 bg-gray-100 border border-dashed rounded dark:bg-transparent dark:border-gray-600">
        <p>{children}</p>
      </div>
    </div>
  )
}
export default CardEmpty

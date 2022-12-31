import { ReactNode } from 'react'

export type CardBodyProps = {
  children?: ReactNode
  subtitle?: string
  title?: string
}

const CardBody: React.FC<CardBodyProps> = ({ children, subtitle, title }) => {
  return (
    <div className="flex flex-col p-5 space-y-3 overflow-auto">
      {title ? (
        <h2 className="dark:text-white text-xl">{title}</h2>
      ) : (
        <div className="w-full h-8 bg-gray-400 rounded animate-pulse" />
      )}
      {subtitle && <h3 className="text-sm dark:text-gray-50">{subtitle}</h3>}
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

export default CardBody

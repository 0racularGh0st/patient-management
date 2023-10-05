import { ReactNode } from 'react'
type ContentLayoutProps = {
  children: ReactNode,
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div className="flex justify-center items-start px-3 sm:px-8 h-[calc(100vh-72px)]">
      {children}
    </div>
  )
}

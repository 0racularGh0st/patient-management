import { ReactNode } from 'react'
type ContentLayoutProps = {
  children: ReactNode,
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div className="flex justify-center items-center px-3 sm:px-8 h-screen">
      {children}
    </div>
  )
}

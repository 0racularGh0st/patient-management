import { ReactNode } from 'react'
type ContentLayoutProps = {
  children: ReactNode,
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)]">
      {children}
    </div>
  )
}

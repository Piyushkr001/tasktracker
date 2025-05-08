import React from 'react'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='min-h-screen'>
        <div>
          <Navbar />
          {children}
          <Footer />
        </div>
    </div>
  )
}

export default Layout
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Academy from './pages/Academy'
import Blog from './pages/Blog'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Services from './pages/Services'
import FAQ from './pages/FAQ'
import RefundPolicy from './pages/RefundPolicy'
import CookiesPolicy from './pages/CookiesPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App(){
  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-grow container mx-auto px-4 py-8'>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/shop' element={<Shop/>} />
            <Route path='/product/:id' element={<ProductPage/>} />
            <Route path='/services' element={<Services/>} />
            <Route path='/faq' element={<FAQ/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/academy' element={<Academy/>} />
            <Route path='/blog' element={<Blog/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/checkout' element={<Checkout/>} />
            <Route path='/privacy' element={<Privacy/>} />
            <Route path='/terms' element={<Terms/>} />
            <Route path='/refund-policy' element={<RefundPolicy/>} />
            <Route path='/cookies-policy' element={<CookiesPolicy/>} />
            <Route path='/shipping-policy' element={<ShippingPolicy/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
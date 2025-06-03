import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })
        
        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
       
      navigate(url)
      console.log(url)
  }
    
  return (
   <section className='bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen'>
      {/* Hero Banner Section */}
      <div className='container mx-auto px-4 pt-6'>
          <div className={`w-full h-full min-h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 ${!banner && "animate-pulse my-2" } `}>
              <img
                src={banner}
                className='w-full h-full hidden lg:block object-cover hover:scale-105 transition-transform duration-700'
                alt='banner'
               />
              <img
                src={bannerMobile}
                className='w-full h-full lg:hidden object-cover hover:scale-105 transition-transform duration-700'
                alt='banner'
               />
          </div>
      </div>
             
      {/* Categories Section */}
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-8'>
         
        </div>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded-2xl p-6 min-h-36 grid gap-3 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse border border-gray-100'>
                    <div className='bg-gradient-to-br from-blue-100 to-purple-100 min-h-24 rounded-xl'></div>
                    <div className='bg-gradient-to-r from-blue-100 to-purple-100 h-4 rounded-full'></div>
                    <div className='bg-gradient-to-r from-blue-100 to-purple-100 h-3 rounded-full w-3/4'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div 
                    key={cat._id+"displayCategory"} 
                    className='group cursor-pointer transform hover:scale-105 transition-all duration-300'
                    onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                  >
                    <div className='bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50'>
                      <div className='relative overflow-hidden rounded-xl mb-3'>
                        <img
                           src={cat.image}
                          className='w-full h-15 md:h-29 object-cover group-hover:scale-110 transition-transform duration-500'
                          alt={cat.name}
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      </div>
                    
                    </div>
                  </div>
                )
              })
                           
            )
          }
      </div>
      </div>

       {/* Category Products Section */}
       <div className='bg-white/50 backdrop-blur-sm'>
         <div className='container mx-auto px-4 py-8 space-y-12'>
           {
             categoryData?.map((c,index)=>{
               return(
                 <div key={c?._id+"CategorywiseProduct"} className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100'>
                   <CategoryWiseProductDisplay
                      key={c?._id+"CategorywiseProduct"}
                      id={c?._id}
                      name={c?.name}
                   />
                 </div>
               )
             })
           }
         </div>
       </div>
      </section>
  )
}

export default Home
import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })

            return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL = handleRedirectProductListpage()
    
    return (
        <div className="bg-white border-b border-gray-100 py-8">
            {/* Simple Header */}
            <div className='container mx-auto px-4 flex items-center justify-between mb-6'>
                <h3 className='text-2xl font-bold text-gray-800'>{name}</h3>
                <Link 
                    to={redirectURL} 
                    className='text-blue-600 hover:text-blue-800 font-medium text-sm underline'
                >
                    View All
                </Link>
            </div>

            {/* Products Container */}
            <div className='relative'>
                <div className='flex gap-4 container mx-auto px-4 overflow-x-auto scrollbar-hide' ref={containerRef}>
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct
                                    data={p}
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                />
                            )
                        })
                    }
                </div>

                {/* Simple Navigation Buttons */}
                <div className='absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none hidden lg:flex'>
                    <button 
                        onClick={handleScrollLeft} 
                        className='pointer-events-auto w-10 h-10 bg-white border border-gray-300 hover:border-gray-400 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all'
                    >
                        <FaAngleLeft className="text-gray-600" />
                    </button>
                    <button 
                        onClick={handleScrollRight} 
                        className='pointer-events-auto w-10 h-10 bg-white border border-gray-300 hover:border-gray-400 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all'
                    >
                        <FaAngleRight className="text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
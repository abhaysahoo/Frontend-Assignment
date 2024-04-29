import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import chevron from '../assets/chevron.svg'
import tick from '../assets/tick.png'

const Dropdown = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Select Time')

    const options = [
        { label: 'Last 5 minutes', value: 5 },
        { label: 'Last 15 minutes', value: 15 },
        { label: 'Last 30 minutes', value: 30 },
        { label: 'Last 1 hour', value: 60 },
        { label: 'Last 3 hours', value: 180 },
        { label: 'Last 6 hours', value: 360 },
    ]

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed)
    }

    const handleOptionClick = (option) => {
        setSelectedOption(option.label)
        const startTs = new Date().getTime() - 60000 * option.value
        const endTs = new Date().getTime()
        handleToggle()

        if (location.pathname === '/metrics') {   
            navigate(`/metrics?startTs=${startTs}&endTs=${endTs}`)     
        } else if (location.pathname === '/logs') {
            const baseUrl = window.location.origin
            const path = `/logs?startTs=${startTs}&endTs=${endTs}&liveLogs=true`
            const url = `${baseUrl}${path}`
            window.location.href = url  
        }    
    }

    return (
        !isCollapsed ? (
            <div className={`flex justify-between items-center gap-1.5 border 
            border-[#bbd2f1] rounded-[4px] px-2 py-1 cursor-pointer w-40 bg-white ml-auto`}
                onClick={handleToggle}
            >
                <div className='font-medium text-xs text-[#3E5680] leading-[16.8px]'>
                    {selectedOption}
                </div>
                <img
                    src={chevron}
                    alt='chevron icon'
                    className='w-2 object-contain'
                />
            </div>
        ) : (
            <div className='flex flex-col px-3 py-1 rounded-md bg-white 
            border-[0.3px] border-[#bbd2f1] shadow-[0px_8px_20px_0px_#0034661A] w-40
            absolute z-10 right-0 top-3'>
                {
                    options.map((option, index) => (
                        <div key={index}
                            className={`flex justify-between items-center font-labGrotesque font-medium text-sm 
                            text-[#010202] leading-[16.8px] py-2 cursor-pointer
                            ${index === options.length - 1 ? '' : 'border-b border-[#e0ecfd]'}`}
                                onClick={() => handleOptionClick(option)}
                            >
                            <span>{option.label}</span>
                            {selectedOption === option.label && (
                                <img
                                    src={tick}
                                    alt='tick icon'
                                    className='object-contain mr-1'
                                />
                            )}
                        </div>
                    ))
                }
            </div>
        )
    )
}

export default Dropdown
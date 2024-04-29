import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'

import { formatTimestampForLogs } from '../utils/helper'
import arrowDown from '../assets/arrow-up-long.png'
import { LOGS_LIMIT } from '../constants'

const TerminalWindow = ({
    logs,
    newEntries,
    setNewEntries,
    fetchPreviousLogs,
    containerRef,
    setScrollBarToTheTop,
    loading,
    scrollBarToTheTop,
    liveLogs,
}) => {
    const [showJumpToButton, setShowJumpToButton] = useState(false)

    const handleScroll = () => {
        const container = containerRef.current
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
            setShowJumpToButton(false)
            setNewEntries(0)
        } else {
            if (liveLogs) {
                setShowJumpToButton(true)
            }
        }

        if (container.scrollTop === 0 && liveLogs) {
            setScrollBarToTheTop(true)
            fetchPreviousLogs()
        }
    }

    useEffect(() => {
        const container = containerRef.current
        if (!showJumpToButton) {
            container.scrollTop = container.scrollHeight
        }

        if (logs.length > 0) {
            setNewEntries(prevNewEntries => prevNewEntries + 1)
        }

        container.addEventListener('scroll', handleScroll)
        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [logs])

    const handleClick = () => {
        const container = containerRef.current
        container.scrollTop = container.scrollHeight
    }

    return (
        <div className="flex flex-col w-full h-[calc(100vh-140px)] rounded-lg 
        overflow-hidden bg-[#090F17] relative">
            <div className='bg-[#0E1623] w-full h-[30px] flex justify-center items-center gap-2'>
                {
                    loading && scrollBarToTheTop && (
                        <>
                            <div>
                                <Oval
                                    width="15"
                                    color="#4F46E5"
                                    secondaryColor="#ffffff"
                                    strokeWidth='8'
                                    strokeWidthSecondary='8'
                                    ariaLabel="oval-loading"
                                />
                            </div>
                            <div className='text-[10px] font-firacode font-[450] text-[#82A0CE]'>
                                Loading previous {LOGS_LIMIT} logs
                            </div>
                        </>
                    )
                }

            </div>
            <div ref={containerRef} className="flex flex-col gap-2 h-full p-[10px] 
            overflow-y-scroll">
                {
                    logs.map((log, index) => (
                        <div key={index} className='flex gap-2 border-l-2 border-[#60A5FA] px-2 py-1 
                        text-[#5E7BAA] font-[450] text-xs'>
                            <div className='text-[#5E7BAA] min-w-max'>
                                {formatTimestampForLogs(log.timestamp)}
                            </div>
                            <div className='text-[#5E7BAA]'>
                                [info]
                            </div>
                            <div className='text-[#A8C3E8] font-firacode'>
                                {log.message.slice(0, 200)}
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                showJumpToButton && (
                    <div className='flex gap-1 items-center absolute 
                    bottom-4 right-6 z-10 rounded-[4px] 
                    px-2 py-1.5 bg-[#4338CA] cursor-pointer'
                    onClick={handleClick}
                    >
                        <div className='text-[#E0ECFD] font-medium font-workSans text-[10px]'>
                            {`${newEntries} new logs`}
                        </div>
                        <div>
                            <img
                                src={arrowDown}
                                className='w-2 object-contain'
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TerminalWindow;
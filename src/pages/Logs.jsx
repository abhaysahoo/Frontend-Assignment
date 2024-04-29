import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { RotatingLines } from 'react-loader-spinner'

import TerminalWindow from '../components/TerminalWindow'
import CustomTimeRangePicker from '../components/CustomTimeRangePicker'
import { MimicLogs } from '../utils/api-mimic'
import { formatTimestamp } from '../utils/helper'
import { LOGS_LIMIT as limit, AVERAGE_LOG_HEIGHT } from '../constants'


const Logs = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)

  const [logs, setLogs] = useState([])
  const [timeRange, setTimeRange] = useState(null)
  const [newEntries, setNewEntries] = useState(0)
  const [startTs, setStartTs] = useState(0)
  const [endTs, setEndTs] = useState(0)
  const [scrollBarToTheTop, setScrollBarToTheTop] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(0)

  let liveLogs = false

  if (queryParams.size) {
    liveLogs = queryParams.get('liveLogs')
  }

  const fetchPreviousLogs = () => {
    let t = startTs
    setStartTs(prevStartTs => prevStartTs - (endTs - prevStartTs))
    setEndTs(t)
  }

  const prependAndMaintainScrollPosition = (nextLogs) => {
    setLogs(prevLogs => [...nextLogs.reverse(), ...prevLogs])
    containerRef.current.scrollTop = AVERAGE_LOG_HEIGHT * limit
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (startTs && endTs) {
          if (!scrollBarToTheTop) {
            setNewEntries(0)
          }

          setLoading(true)
          const nextLogs = await MimicLogs.fetchPreviousLogs({ startTs, endTs, limit })
          prependAndMaintainScrollPosition(nextLogs)
          setLoading(false)

          if (liveLogs) {
            await MimicLogs.subscribeToLiveLogs(livelog => {
              setLogs(prevLogs => [...prevLogs, livelog]);
            })
          }

          const startTime = formatTimestamp(startTs)
          const endTime = formatTimestamp(endTs)
          setTimeRange({ startTime, endTime })
        } else {
          if (queryParams.size) {
            setStartTs(parseInt(queryParams.get('startTs')))
            setEndTs(parseInt(queryParams.get('endTs')))
          }
        }
      } catch (error) {
        console.error('Error while fetching date: ', error)
      }
    }

    fetchLogs()
  }, [location.search, startTs, endTs])

  return (
    <main className='bg-[#fafcff] h-full w-full min-h-[calc(100vh-67px)] px-4 sm:px-8 py-8'>
      <div className='flex flex-col justify-center w-full min-h-full 
      max-w-screen-2xl mx-auto'>
        <CustomTimeRangePicker />
        <div className='w-full h-8 py-2'>
          {
            loading ? (
              <div className='flex justify-end gap-2 items-center'>
                <RotatingLines
                  width="20"
                  strokeColor="#99DAFF"
                  ariaLabel="rotating-lines-loading"
                />
                Loading Logs...
              </div>
            ) : (
              timeRange && (
                <p className="font-medium text-xs text-[#1c2a42] text-right">
                  {`Showing logs for ${timeRange.startTime} → ${timeRange.endTime}`}
                </p>
              )
            )
          }
        </div>


        <TerminalWindow
          logs={logs}
          newEntries={newEntries}
          setNewEntries={setNewEntries}
          fetchPreviousLogs={fetchPreviousLogs}
          containerRef={containerRef}
          setScrollBarToTheTop={setScrollBarToTheTop}
          loading={loading}
          scrollBarToTheTop={scrollBarToTheTop}
          liveLogs={liveLogs}
        />
      </div>
    </main>
  )
}

export default Logs
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DateTimePicker from "react-datetime-picker"

import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'

const CustomTimeRangePicker = () => {
    const navigate = useNavigate()
    const [timestamp1, setTimestamp1] = useState(null)
    const [timestamp2, setTimestamp2] = useState(null)

    const getLogs = () => {
        if (timestamp1 && timestamp2) {
            const startTs = new Date(timestamp1).getTime()
            const endTs = new Date(timestamp2).getTime()

            const baseUrl = window.location.origin;
            const path = startTs <= endTs ?
                `/logs?startTs=${startTs}&endTs=${endTs}`
                : `/logs?startTs=${endTs}&endTs=${startTs}`
            const url = `${baseUrl}${path}`
            window.location.href = url
        }
    }

    const handleTimestamp1 = (date) => {
        setTimestamp1(date)
    }

    const handleTimestamp2 = (date) => {
        setTimestamp2(date)
    }

    return (
        <div className="flex flex-wrap gap-3 items-center flex-grow">
            <DateTimePicker
                onChange={handleTimestamp1}
                value={timestamp1}
            />
            <DateTimePicker
                onChange={handleTimestamp2}
                value={timestamp2}
            />
            <div className="bg-blue-700 text-white rounded-md px-2 py-1 
            cursor-pointer border-none hover:bg-blue-500 font-workSans 
            font-medium hover:shadow-md text-sm flex items-center capitalize"
                onClick={getLogs}
            >
                get logs
            </div>
        </div>
    )
}

export default CustomTimeRangePicker
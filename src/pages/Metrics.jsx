import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { RotatingLines } from "react-loader-spinner"

import Chart from "../components/Chart"
import { formatTimestamp } from "../utils/helper"
import { MimicMetrics } from "../utils/api-mimic"

const Metrics = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)

    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState(null)

    let startTs = 0
    let endTs = 0

    if(queryParams.size) {
        startTs = parseInt(queryParams.get('startTs'))
        endTs = parseInt(queryParams.get('endTs')) 
    }
 
    const [fetchedData, setFetchedData] = useState([])

    useEffect(() => { 
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await MimicMetrics.fetchMetrics({ startTs, endTs })
                setFetchedData(response)

                if (startTs && endTs) {
                    const startTime = formatTimestamp(startTs)
                    const endTime = formatTimestamp(endTs)
                    setTimeRange({ startTime, endTime })
                }  
            } catch(error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }    
        }
        
        fetchData()
    }, [startTs, endTs])


    return (
        <main className="bg-[#fafcff] h-full w-full min-h-[calc(100vh-67px)] px-4 sm:px-8 py-8">
            <div className="flex flex-col w-full h-full max-w-screen-2xl mx-auto
            border rounded-lg border-slate-200 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 p-3 
                border-b border-b-slate-200 bg-white">
                    <h1 className="font-bold text-2xl font-labGrotesque text-[#010202]">Metrics</h1>
                    {
                        loading ? (
                            <RotatingLines 
                                width="32"
                                strokeColor="#99DAFF"
                                ariaLabel="rotating-lines-loading"
                            />
                        ) : (         
                            timeRange && (
                            <p className="font-medium text-xs text-[#1c2a42]">
                                {`${timeRange.startTime} → ${timeRange.endTime}`}
                            </p>
                            )     
                        )  
                    }        
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#fafcff]">
                    {
                        fetchedData.map((graph, index) => (
                            <div key={graph.name} className="flex justify-center 
                            items-center border border-[#cee0f8] rounded-lg bg-white relative">
                                <Chart
                                    type={index === (fetchedData.length - 1) ? 'Area' : 'Line'}
                                    graph={graph}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </main>
    )
}

export default Metrics
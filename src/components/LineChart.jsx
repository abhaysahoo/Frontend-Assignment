import { Line } from "react-chartjs-2"
import { useState } from "react"

import newTabLink from '../assets/arrow-up-right-from-square.png'


const LineChart = ({ data, name }) => {
    const [selectedPoints, setSelectedPoints] = useState([])
    const [showViewLogs, setShowViewLogs] = useState(false)

    const handlePointClick = (event, chartElements) => {
        if (chartElements && chartElements.length > 0) {
            const pointIndex = chartElements[0].index
            const datasetIndex = chartElements[0].datasetIndex
            const label = data.labels[pointIndex]
            const value = data.datasets[datasetIndex].data[pointIndex]

            if (selectedPoints.length < 2) {
                setSelectedPoints(prevSelectedPoints => [...prevSelectedPoints, { label, value }])
                if (selectedPoints.length == 1) {
                    setShowViewLogs(true)
                }
            } else {
                setSelectedPoints([{ label, value }])
                setShowViewLogs(false)
            }
        }
    };

    const handleShowLogsClick = () => {
        const timeRanges = selectedPoints.map(selectedPoint => {
            const timeRange = selectedPoint.label.split(":").map(numberInString => Number(numberInString))
            return { hrs: timeRange[0], minutes: timeRange[1] }
        })

        let startTs
        let endTs

        if (timeRanges[0].hrs >= 18 && timeRanges[1].hrs <= 6) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday.setHours(timeRanges[0].hrs, timeRanges[0].minutes, 0, 0)

            startTs = yesterday.getTime()
            const today = new Date()
            endTs = today.setHours(timeRanges[1].hrs, timeRanges[1].minutes, 0, 0)
        } else if (timeRanges[1].hrs >= 18 && timeRanges[0].hrs <= 6) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday.setHours(timeRanges[1].hrs, timeRanges[1].minutes, 0, 0)

            startTs = yesterday.getTime()
            const today = new Date()
            endTs = today.setHours(timeRanges[0].hrs, timeRanges[0].minutes, 0, 0)
        } else {
            const today = new Date()
            if (timeRanges[0].hrs < timeRanges[1].hrs) {
                startTs = today.setHours(timeRanges[0].hrs, timeRanges[0].minutes, 0, 0)
                endTs = today.setHours(timeRanges[1].hrs, timeRanges[1].minutes, 0, 0)
            } else if (timeRanges[0].hrs === timeRanges[1].hrs) {
                if (timeRanges[0].minutes <= timeRanges[1].minutes) {
                    startTs = today.setHours(timeRanges[0].hrs, timeRanges[0].minutes, 0, 0)
                    endTs = today.setHours(timeRanges[1].hrs, timeRanges[1].minutes, 0, 0)
                } else {
                    startTs = today.setHours(timeRanges[1].hrs, timeRanges[1].minutes, 0, 0)
                    endTs = today.setHours(timeRanges[0].hrs, timeRanges[0].minutes, 0, 0)
                }
            } else {
                startTs = today.setHours(timeRanges[1].hrs, timeRanges[1].minutes, 0, 0)
                endTs = today.setHours(timeRanges[0].hrs, timeRanges[0].minutes, 0, 0)
            }
        }

        const baseUrl = window.location.origin;
        const path = `/logs?startTs=${startTs}&endTs=${endTs}`
        const url = `${baseUrl}${path}`

        setShowViewLogs(false)
        setSelectedPoints([])
        window.open(url, '_blank')
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    color: '#010202',
                    padding: 20,
                    font: {
                        size: 14,
                        family: 'Lab Grotesque',
                    },
                },
            },
            title: {
                display: true,
                text: name,
                align: 'start',
                color: '#3E5680',
                padding: {
                    bottom: 20,
                    top: 4,
                },
                font: {
                    size: 14,
                    family: 'Work Sans',
                },
            },
        },
        scales: {
            x: {
                border: {
                    display: false,
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    autoSkipPadding: 15,
                    padding: 10,
                    color: '#6F8EBD',
                    font: {
                        family: 'Work Sans',
                    },
                },
                grid: {
                    color: '#E0ECFD',
                },
                major: {
                    enabled: true,
                },
                offset: true,
            },
            y: {
                position: 'right',
                border: {
                    display: false,
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    autoSkipPadding: 15,
                    padding: 0,
                    color: '#6F8EBD',
                    font: {
                        family: 'Work Sans',
                    },
                },
                grid: {
                    color: '#E0ECFD',
                    offset: true,
                    tickLength: 10,
                },
                major: {
                    enabled: true,
                },
            },
        },
        elements: {
            point: {
                radius: 0,
            },
            line: {
                borderWidth: 1,
            },
        },
        spanGaps: true,
        normalized: true,
        layout: {
            padding: {
                left: 16,
                right: 16,
                top: 12,
                bottom: 12,
            },
        },
        onClick: handlePointClick,
    };

    const isSelectedPoint = (point, index) => {
        for (let i = 0; i < selectedPoints.length; i++) {
            const selectedPoint = selectedPoints[i]
            if (selectedPoint.label === data.labels[index] && selectedPoint.value === point) {
                return true
            }
        }
        return false
    }

    const highlightedData = {
        ...data,
        datasets: data.datasets.map(dataset => ({
            ...dataset,
            pointBackgroundColor: dataset.data.map((point, index) => {
                return isSelectedPoint(point, index) ? '#F97316' : dataset.pointBorderColor || 'rgba(0, 0, 0, 0.1)'
            }),
            pointBorderColor: dataset.data.map((point, index) => {
                return isSelectedPoint(point, index) ? '#FFFFFF' : dataset.pointBorderColor || 'rgba(0, 0, 0, 0.1)'
            }),
            pointRadius: dataset.data.map((point, index) => {
                return isSelectedPoint(point, index) ? 4 : 0
            }),
            pointBorderWidth: dataset.data.map((point, index) => {
                return isSelectedPoint(point, index) ? 2 : 1
            }),
        })),
    };

    return (
        <>
            <Line
                options={options}
                data={highlightedData}
            />

            {
                showViewLogs && (
                    <div className="absolute p-3 rounded-md bg-white 
                    flex justify-center items-center border border-[#cee0f8] 
                    shadow-[0px_8px_20px_0px_#0034661A] cursor-pointer bottom-1/4 right-1/4"
                        onClick={handleShowLogsClick}
                    >
                        <div className="flex items-center gap-1.5 rounded-md bg-[#010202] px-3 py-1.5">
                            <div>
                                <img
                                    src={newTabLink}
                                    className="object-contain w-3"
                                />
                            </div>
                            <div>
                                <span className="font-labGrotesque text-white text-sm font-md 
                                shadow-[0px_2px_4px_0px_#0034661A]">
                                    View Logs
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default LineChart
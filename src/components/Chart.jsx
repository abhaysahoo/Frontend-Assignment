import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js"

import LineChart from "./LineChart"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
)

const Chart = ({ type, graph }) => {
    const labels = graph.graphLines[0].values.map(item => {
        const timestamp = new Date(item.timestamp)
        const hour = timestamp.getHours()
        let minute = timestamp.getMinutes()
        minute = minute <= 9 ? '0' + minute : minute
        return `${hour}:${minute}`
    })

    const data1 = graph.graphLines[0].values.map(item => item.value)
    const data2 = graph.graphLines[1].values.map(item => item.value)
    const data3 = type === 'Line' && graph.graphLines[2].values.map(item => item.value)

    let data = {}

    if (type === 'Line') {
        data = {
            labels,
            datasets: [
                {
                    label: graph.graphLines[0].name,
                    data: data1,
                    borderColor: '#DC2626',
                    backgroundColor: '#DC2626',
                },
                {
                    label: graph.graphLines[1].name,
                    data: data2,
                    borderColor: '#2563EB',
                    backgroundColor: '#2563EB',
                },
                {
                    label: graph.graphLines[2].name,
                    data: data3,
                    borderColor: '#059669',
                    backgroundColor: '#059669',
                },
            ],
        }
    } else {
        data = {
            labels,
            datasets: [
                {
                    label: graph.graphLines[0].name,
                    data: data1,
                    fill: {
                        target: 1,
                        above: 'rgb(37, 99, 235, 0.2)',
                    },
                    borderColor: '#2563EB',
                    backgroundColor: '#2563eb',

                },
                {
                    label: graph.graphLines[1].name,
                    data: data2,
                    fill: {
                        target: 'origin',
                        above: 'rgb(220, 38, 38, 0.2)',
                    },
                    borderColor: '#DC2626',
                    backgroundColor: '#DC2626',
                },
            ],
        }
    }

    return (
        <LineChart data={data} name={graph.name} />
    )
}

export default Chart
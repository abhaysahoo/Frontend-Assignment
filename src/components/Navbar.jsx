import { Link, NavLink } from 'react-router-dom'

import Dropdown from './Dropdown'
import logo from '../assets/TF logo.svg'
import metrics from '../assets/metrics.png'
import metricsGray from '../assets/metrics-gray.png'
import logs from '../assets/list-active.png'
import logsGray from '../assets/list.png'

const Navbar = () => {
    const isTabActive = (match, location) => {
        return match != null
    }

    return (
        <header className='w-full border-b border-b-slate-300 bg-white shadow-sm py-4 px-4 sm:px-8'>
            <div className='w-full max-w-screen-2xl mx-auto flex justify-between 
            items-center relative flex-wrap gap-2'>
                <nav className='flex gap-4 items-center'>
                    <Link to='/'>
                        <img
                            src={logo}
                            alt='TrueFoundry Logo'
                            className='w-40 object-contain mr-4'
                        />
                    </Link>

                    <NavLink isActive={isTabActive} to='/metrics' className={({ isActive }) => isActive ?
                        `border-b-2 border-[#5501E1] font-bold font-labGrotesque text-[#010202]`
                        : `font-inter font-medium text-gray-600`}>
                        {({ isActive }) => (
                            <div className='flex gap-1 items-baseline p-1'>
                                <img
                                    src={isActive ? metrics : metricsGray}
                                    alt='metrics tab'
                                    className='object-contain w-3'
                                />
                                <span>Metrics</span>
                            </div>
                        )}
                    </NavLink>

                    <NavLink isActive={isTabActive} to='/logs' className={({ isActive }) => isActive ?
                        `border-b-2 border-[#5501E1] font-bold font-labGrotesque text-[#010202]`
                        : `font-inter font-medium text-gray-600`}>
                        {({ isActive }) => (
                            <div className='flex gap-1 items-baseline font-inter p-1'>
                                <img
                                    src={isActive ? logs : logsGray}
                                    alt='logs tab'
                                    className='object-contain w-3'
                                />
                                <span>Logs</span>
                            </div>
                        )}
                    </NavLink>
                </nav>

                <Dropdown />
            </div>
        </header>
    )
}

export default Navbar
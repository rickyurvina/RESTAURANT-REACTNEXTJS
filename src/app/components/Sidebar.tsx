import React, { Component } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()
    return (
        <div className="md:w-2/5 xl:w-1/5 bg-gray-800">
            <div className="p-6">
                <p className='uppercase text-2xl tracking-wide text-center font-bold'>Restaurant App</p>
                <p className='mt-3 text-gray-600 text-center'>Manage your restaurant</p>
                <nav className='mt-10 '>
                    <li className={pathname == "/" ? "text-yellow-500 p- hover:bg-yellow-500 hover:text-gray-900" : "p-1 text-gray-400 hover:bg-yellow-500 hover:text-gray-900"}>
                        <Link href="/">Orders</Link>
                    </li>
                    <li className={pathname == "/menu" ? "text-yellow-500 p- hover:bg-yellow-500 hover:text-gray-900" : "p-1 text-gray-400 hover:bg-yellow-500 hover:text-gray-900"}>
                        <Link href="/menu">Menu</Link>
                    </li>
                </nav>
            </div>
        </div>
    )
}

'use client'
import Link from "next/link"
import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase'
import { getDatabase, ref, update } from "firebase/database";
import { useRouter } from "next/navigation"


export default function Orders({ order }) {
    const [deliverTime, setDeliverTime] = useState(0)
    const { id, client, total, status, time, order: orderItem } = order
    const firebase = useContext(FirebaseContext)
    const db = getDatabase(firebase.firebase.firebase);

    const setDeliverTimeOrder = async () => {
        try {
            order.time = deliverTime;
            const updates = {};
            updates['/orders/' + id] = order;
            update(ref(db), updates);
        } catch (error) {
            console.log(error)
        }
    }

    const updateStatus = async () => {
        try {
            order.status = "completed";
            const updates = {};
            updates['/orders/' + id] = order;
            update(ref(db), updates);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className="sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <div className="p-3 shadow-md bg-white">
                    <h1 className="text-yellow-600 text-lg font-bold">{order.id}</h1>
                    {orderItem.map(ord => {
                        return (
                            <p className="text-gray-600" key={ord.id}>
                                {ord.cant} {ord.name}
                            </p>
                        )
                    })}
                    <p className="text-gray-700 font-bold">
                        ${total}
                    </p>
                    {time === 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Delivery time
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={deliverTime}
                                onChange={e => setDeliverTime(parseInt(e.target.value))}
                                placeholder="Delivery time"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                            <button
                                type="submit"
                                onClick={() => {
                                    setDeliverTimeOrder()
                                }}
                                className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            >
                                Set delivery time
                            </button>
                        </div>
                    )}

                    {time > 0 && (
                        <p className="text-gray-700">
                            Delivery time:
                            <span className="font-bold"> {time} Min</span>
                        </p>
                    )}

                    {status != "completed" && time > 0 && (
                        <button
                            type="button"
                            className="bg-blue-800 hover:bg-blue-700 w-full mt-5 p-2 text-white uppercase font-bold"
                            onClick={() => updateStatus()}

                        >
                            Complete
                        </button>
                    )}
                </div>
            </div>
        </>
    )

}
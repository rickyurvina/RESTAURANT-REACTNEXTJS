import React, { useContext, useRef } from 'react'
import { FirebaseContext } from '../firebase'
import { getDatabase, ref, set, child, get, onValue, update, push } from "firebase/database";

const Plate = ({ plate }) => {

    const { name, price, category, image, exist, description } = plate

    const existRef = useRef(exist)
    const firebase = useContext(FirebaseContext)
    const db = getDatabase(firebase.firebase.firebase);
    const uodateAvailable = () => {
        const exist = existRef.current.value === 'true'
        plate.exist = exist
        const updates = {};
        updates['/plates/' + name] = plate;
        update(ref(db), updates);
    }

    return (
        <div className="w-full px-3 mb-4">
            <div className='p-5 shadow-md bg-white'>
                <div className='lg:flex'>
                    <div className='lg:w-5/12 xl:w-3/12'>
                        <img src={image} alt={name} />
                        <div className='sm:flex sm:-mx-2 pl-2'>
                            <label className='block mt-5 sm:w-2/4'>
                                <span className='block text-gray-800 mb-2'>
                                    Exist
                                </span>
                                <select
                                    className='bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
                                    value={exist}
                                    ref={existRef}
                                    onChange={() => {
                                        uodateAvailable()
                                    }}
                                >
                                    <option value='true' className='text-gray-700'>Available</option>
                                    <option value='false' className='text-gray-700'>No Available</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className='lg:w-7/12 xl:w-9/12 pl-5'>
                        <p className='font-bold text-2xl text-yellow-600 mb-4'>
                            {name}
                        </p>
                        <p className='text-gray-600 mb-4'>Categoy:{' '}
                            <span className='text-gray-700 font-bold'> {category.toUpperCase()}</span>
                        </p>

                        <p className='text-gray-600 mb-4'>{description}
                        </p>

                        <p className='text-gray-600 mb-4'>Price:{' '}
                            <span className='text-gray-700 font-bold'> ${price}</span>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Plate
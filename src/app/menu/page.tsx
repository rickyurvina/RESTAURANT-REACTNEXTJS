
'use client'
import Link from "next/link"
import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase'
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
import { useRouter } from "next/navigation"
import Plate from "./plate";


export default function Menu() {

  const [plates, setPlates] = useState<any[]>([])
  // let plates = []

  const firebase = useContext(FirebaseContext)
  const db = getDatabase(firebase.firebase.firebase);

  useEffect(() => {
    const getPlates = () => {
      const plates = ref(db, 'plates/');
      onValue(plates, (snapshot) => {
        const data = snapshot.val();
        const platesArray = Object.values(data);
        console.log(data)
        setPlates(platesArray)
      });

      // const dbRef = ref(db);
      // get(child(dbRef, `plates/`)).then((snapshot) => {
      //   if (snapshot.exists()) {
      //     console.log(snapshot.val())
      //     const data = snapshot.val()
      //     const platesArray = Object.values(data);
      //     setPlates(platesArray)
   
      //   } else {
      //     console.log("No data available");
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });
    }
    getPlates()

  }, [])


  return (
    <>
      <h1 className='text-3xl font-light mb-4 mt-4'>
        New Plate
      </h1>
      <Link href={`/plates`} className="bg-blue-700 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold">
        Add New Plate
      </Link>

      {plates.map(plate => {
        return(
         <Plate key={plate.image}  plate={plate}/>
        )})}
    </>
  )
}

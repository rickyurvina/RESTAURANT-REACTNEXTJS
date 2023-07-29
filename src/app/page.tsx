'use client'
import React, { useState, useEffect, useContext, createContext, use } from 'react'
import { getDatabase, ref, set, child, get, onValue, query, orderByKey, equalTo, orderByChild } from "firebase/database";
import { useRouter } from "next/navigation"
import { FirebaseContext } from './firebase'
import Orders from './components/Orders';

export default function Home() {
  const [orders, setOrders] = useState<any[]>([])

  const firebase = useContext(FirebaseContext)
  const db = getDatabase(firebase.firebase.firebase);

  useEffect(() => {
    const getOrders = () => {

      const ordersRef = ref(db, 'orders/');
      const statusToFilter = 'pending';

      const filteredOrdersQuery = query(ordersRef, orderByChild('status'), equalTo(statusToFilter));

      onValue(filteredOrdersQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersArray = Object.values(data);
          setOrders(ordersArray)
        } else {
          console.log('No se encontraron pedidos pendientes.');
        }
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
    getOrders()
  }, [])

  return (
    <>
      <h1 className="text-3xl font-light mb-2">
        Orders
      </h1>
      <div className="sm:flex sm:flex-wrap -mx-3">
        {orders.map(order => {
          return (
            <Orders key={order.id} order={order} />
          )
        })}
      </div>
    </>
  )
}

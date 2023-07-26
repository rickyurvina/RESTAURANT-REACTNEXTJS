
import Link from "next/link"

export default function Menu() {
  return (
    <>
      <h1 className='text-3xl font-light mb-4 mt-4'>
        New Plate
      </h1>
      <Link href={`/plates`} className="bg-blue-700 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold">
        Add New Plate
      </Link>

    </>
  )
}

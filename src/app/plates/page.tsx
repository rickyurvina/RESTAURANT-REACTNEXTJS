"use client"
import { useFormik } from "formik"
import * as Yup from 'yup'
import React, { useContext, useState } from 'react'
import { FirebaseContext } from '../firebase'
import { getDatabase, ref, set } from "firebase/database";
import { useRouter } from "next/navigation"
import { getStorage, ref as refS, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { generateId } from "../helpers";

export default function NewPlate() {

  const [image, setImage] = useState<File>();
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  let url = ""

  const router = useRouter()
  const firebase = useContext(FirebaseContext)
  const db = getDatabase(firebase.firebase.firebase);
  const storage = getStorage(firebase.firebase.firebase);


  const handleSubmit = () => {
    return new Promise((resolve, reject) => {
      const file = image;

      if (!file) {
        reject("No file selected");
        return;
      }

      setUploading(true);

      const storageRef = refS(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log('Upload is ' + progress + '% done');
          setProgressPercent(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          setUploading(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(typeof downloadURL);
            url = downloadURL
            setUploading(false);
            console.log('File available at', url);
            console.log("uploadind state", uploading)
            resolve();
          });
        }
      );
    });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      category: '',
      file_: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'The name must have at least 3 characters').required('The name is required'),
      price: Yup.number().min(1, 'The number must have at least 1').required('The price is required'),
      category: Yup.string().required('The category is required'),
      description: Yup.string().min(10, 'The description must have at least 10 characters').required('The description is required'),
    }),
    onSubmit: async (values) => {
      try {
        // Ejecutamos la función asincrónica y esperamos a que termine antes de continuar.
        await handleAsyncSubmit(values);
      } catch (error) {
        console.log(error);
      }
    },
  })

  const handleAsyncSubmit = async (values) => {
    await handleSubmit();
    const id = generateId()
    const newPlate = {
      name: values.name,
      price: values.price,
      category: values.category,
      description: values.description,
      image: url,
      exist: true,
      id: id
    };
    set(ref(db, 'plates/' + id), newPlate);
    console.log("New plate added");
    router.push('/menu');
  }


  return (
    <>
      <h1 className='text-3xl font-light mb-4 mt-4'> New Plate </h1>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-3xl">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.name}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 text-sm font-bold mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                min="0"
                placeholder="$40"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.price && formik.errors.price ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.price}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">-- Select --</option>
                <option value="desayuno">Desayuno</option>
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="bebidas">Bebidas</option>
                <option value="postre">Postre</option>
                <option value="ensaladas">Ensaladas</option>
              </select>
            </div>
            {formik.touched.category && formik.errors.category ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.category}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                htmlFor="file_"
                className="block text-gray-700 text-sm font-bold mb-2">
                Image
              </label>
              <input
                type="file"
                id="file_"
                name="file_"
                value={formik.values.file_}
                onChange={(e) => { setImage(e.target.files[0]) }}
                onBlur={formik.handleBlur}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {uploading && (
              <div className="h-12 relative w-full border">
                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                  style={{ width: `${progressPercent}%` }}></div>
              </div>
            )}
            {url && (
              <p className="bg-green-500 text-white p-3 text-center">
                Image uploaded successfully
              </p>
            )}


            <div className="mb-4">
              <label
                htmlFor="description"

                className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Description of the plate"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
              ></textarea>
            </div>
            {formik.touched.description && formik.errors.description ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.description}</p>
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
              value="Add New Plate"
            />
          </form>
        </div>
      </div >
    </>
  )
}

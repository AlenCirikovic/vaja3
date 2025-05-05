import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [images, setImages] = useState<any[]>([])

  useEffect(()=>{
    fetchImages()
  }, [])

  const fetchImages = async () =>{
    const res = await axios.get("http://localhost:3000/api/images");
    setImages(res.data)
    //console.log(res.data)
  }


  

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        {images.map((image, index) => (
          <div key={image.id}>
            <p>{image.title}</p>
            <p>{image.message}</p>
            <img
              src={image.imageUrl}
              alt={image.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <p>
              By {image.author.username} on{' '}
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
            <p>
              Comments: {image._count.comments}, Votes: {image._count.votes}
            </p>
          </div>
        ))}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

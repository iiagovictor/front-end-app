import instance from '../axios/config'

import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import "./Home.css"

const Home = () => {

  const [jobs, setJobs] = useState([])

  const getJobs = async() => {
    
    try {

      const response = await instance.get("/posts");

      const data = response.data;

      setJobs(data);
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {

    getJobs()

  }, [])

  return (
    <div>
      <h1>Jobs</h1>
      {jobs.length === 0 ? (<p>Buscando Jobs</p>) : (
        jobs.map((job) => (
          <div className="job" key={job.name}>
            <h2>{jobs.title}</h2>
          </div>
        ))
      )}
    </div>
  )
}

export default Home
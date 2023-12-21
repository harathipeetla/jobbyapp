import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = props => {
  console.log(props)
  const onClickFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  // <AllJobs />
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">
            Find The Job That Fits
            <br /> You Life
          </h1>
          <p className="home-description">
            Miilons of people are searching for jobs, salary information,
            company reviews,Find the job that fits your abilities and potential.
          </p>
          <Link to="/jobs">
            <button
              type="button"
              className="shop-now-btn"
              onClick={onClickFindJobs}
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home

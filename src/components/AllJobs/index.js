import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobCardItem from '../JobCardItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureVirwImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusContants.initial,
    profileData: [],
    jobsData: [],
    apiJobsStatus: apiStatusContants.initial,
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    searchInput: '',
  }

  componentDidMount = () => {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusContants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    // const {checkboxInputs, radioInput, searchInput} = this.state
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      // const profile = data.profile_details
      const updatedDataProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      console.log(updatedDataProfile)
      this.setState({
        profileData: updatedDataProfile,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobsStatus: apiStatusContants.inProgress})
    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    //const type = activeCheckBoxList.join(',')

    const url = ` https://apis.ccbp.in/jobs?employment_type=${activeCheckBoxList}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    // const url = `https://apis.ccbp.in/jobs`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok === true) {
      const filteredJobsList = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        jobDescription: each.job_description,
        employmentType: each.employment_type,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(filteredJobsList)
      this.setState({
        jobsData: filteredJobsList,
        apiJobsStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusContants.failure})
    }
  }
  //

  onchangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onchangeSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onClickCheckBox = event => {
    const {activeCheckBoxList} = this.state

    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onSuccessProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-icon" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onSuccessJobsView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length > 0
    return noOfJobs ? (
      <ul className="ul-job-items-container">
        {jobsData.map(eachItem => (
          <JobCardItem key={eachItem.id} jobsData={eachItem} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  onRetryProfile = () => this.getProfileData()

  onRetryJobs = () => this.getJobsData()

  onFailProfileView = () => (
    <>
      <h1>profile Fail</h1>
      <button type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </>
  )

  onFailJobsView = () => (
    <div className="failure-img-button-container">
      <img className="failure-img" src={failureVirwImg} alt="failure view" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onGetCheckBoxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckBox}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="radio"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onchangeSalaryRange}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRenderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContants.success:
        return this.onSuccessProfileView()
      case apiStatusContants.failure:
        return this.onFailProfileView()
      case apiStatusContants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  onRenderJobs = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiStatusContants.success:
        return this.onSuccessJobsView()
      case apiStatusContants.failure:
        return this.onFailJobsView()
      case apiJobsStatus.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  onRenderSearch = () => {
    const {searchInput} = this.state

    return (
      <>
        <input
          className="search-input"
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onchangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          data-testid="searchButton"
          type="button"
          className="searh-button"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    //

    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="sm-search-container">{this.onRenderSearch()}</div>
          <div className="side-bar-container">
            {this.onRetryProfile()}
            <hr className="hr-line" />
          </div>
          <h1 className="text">Type of Employment</h1>
          {this.onGetCheckBoxesView()}
          <hr className="hr-line" />
          <h1 className="text">Salary Range</h1>
          {this.onGetRadioButtonView()}
        </div>
        <div className="jobs-container">
          <div className="lg-search-container">{this.onRenderSearch()}</div>
          {this.onRenderJobs()}
        </div>
      </>
    )
  }
  //
}
export default AllJobs

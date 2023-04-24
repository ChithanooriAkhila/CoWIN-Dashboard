import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const fetchingConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {
    isLoading: fetchingConstants.initial,
    last7DaysVaccination: [],
    byAgeDetails: [],
    byGenderDetails: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({isLoading: fetchingConstants.loading})

    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const last7DaysVaccinationDetails = data.last_7_days_vaccination.map(
        obj => ({
          vaccineDate: obj.vaccine_date,
          dose1: obj.dose_1,
          dose2: obj.dose_2,
        }),
      )

      const ageDetails = data.vaccination_by_age.map(range => ({
        age: range.age,
        count: range.count,
      }))
      const genderDetails = data.vaccination_by_gender.map(genderType => ({
        gender: genderType.gender,
        count: genderType.count,
      }))

      this.setState({
        isLoading: fetchingConstants.success,
        last7DaysVaccination: last7DaysVaccinationDetails,
        byAgeDetails: ageDetails,
        byGenderDetails: genderDetails,
      })
    } else {
      this.setState({
        isLoading: fetchingConstants.failure,
      })
    }
  }

  renderCowinDashboardSuccessView = () => {
    const {last7DaysVaccination, byAgeDetails, byGenderDetails} = this.state
    return (
      <div>
        <VaccinationCoverage
          vaccinationCoverageDetails={last7DaysVaccination}
        />
        <VaccinationByGender vaccinationByGenderDetails={byGenderDetails} />
        <VaccinationByAge vaccinationByAgeDetails={byAgeDetails} />
      </div>
    )
  }

  renderCowinDashboardFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#000000" height={80} width={80} />
    </div>
  )

  renderCowinDashboard = () => {
    const {isLoading} = this.state

    switch (isLoading) {
      case fetchingConstants.success:
        return this.renderCowinDashboardSuccessView()
      case fetchingConstants.failure:
        return this.renderCowinDashboardFailureView()
      case fetchingConstants.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1>Co-win</h1>
        </div>
        <h1>CoWIN Vaccination in India</h1>
        <div>{this.renderCowinDashboard()}</div>
      </>
    )
  }
}

export default CowinDashboard

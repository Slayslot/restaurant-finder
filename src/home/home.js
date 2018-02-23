import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigateIcon from '../images/navigate.svg';
import SearchIcon from '../images/search.svg';
import './home.css';

const addAutoComplete = (google, input, renderError, updateLocation) => {
    const autoComplete = new google.maps.places.Autocomplete(input);
    autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        if (!place.geometry) {
            const { ZERO_RESULTS } = google.maps.GeocoderStatus;
            renderError(ZERO_RESULTS);
        } else {
            updateLocation(place.geometry.location.lat(), place.geometry.location.lng());
        }
    });
};

const setErrorMap = (google, errorMap) => {
    const { ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
        UNKNOWN_ERROR,
        ERROR } = google.maps.GeocoderStatus;
    errorMap.set(ZERO_RESULTS, 'Unable to find the location')
        .set(OVER_QUERY_LIMIT, 'Unable to process the request.')
        .set(REQUEST_DENIED, 'Request denied.')
        .set(INVALID_REQUEST, 'Invalid request.')
        .set(UNKNOWN_ERROR, 'Something went wrong. Please try again.')
        .set(ERROR, 'Unable to connect to the server. Please try again.')
        .set('ZOMATO_ERROR', 'Unable to fetch the restaurants. Please try again.')
        .set('DETECT_FAIL', 'Unable to detect your location.');
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.detectLocation = this.detectLocation.bind(this);
        this.locationChange = this.locationChange.bind(this);
        this.locationKeyUp = this.locationKeyUp.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
        this.handleGeocoder = this.handleGeocoder.bind(this);
        this.renderError = this.renderError.bind(this);
        this.errorMap = new Map();
        this.state = {
            location: '',
            error: null
        }
    }

    detectLocation() {
        const { updateLocation } = this.props;
        navigator.geolocation.getCurrentPosition(position => {
            updateLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
            this.setState({ error: 'DETECT_FAIL' });
        },
        {
            enableHighAccuracy: true,
            timeout : 5000
        });
    }

    locationChange(event) {
        this.setState({ location: event.target.value, error: null });
        if(this.props.error !== null) {
            this.props.resetError();
        }
    }

    locationKeyUp(event) {
        if(event.keyCode === 13)
            this.searchLocation();
    }

    searchLocation() {
        const { location } = this.state;
        const { google } = this.props;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: location
        }, this.handleGeocoder);
    }

    componentDidMount() {
        const { google, updateLocation } = this.props;
        if(google !== undefined) {
            setErrorMap(google, this.errorMap);
            addAutoComplete(google, this.input, this.renderError, updateLocation);
        }
     }

    componentWillReceiveProps({ google, error, updateLocation }) {
        this.errorMap = new Map();
        if(this.props.google === undefined && google !== undefined) {
            setErrorMap(google, this.errorMap);
            addAutoComplete(google, this.input, this.renderError, updateLocation);
        }
        if(this.props.error === null && error !== null) {
            this.setState({ error });
        }
    }

    handleGeocoder(result, status) {
        const { google, updateLocation } = this.props;
        if (status === google.maps.GeocoderStatus.OK) {
            updateLocation(result[0].geometry.location.lat(), result[0].geometry.location.lng());
        } else {
            this.setState({ error: status });
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    }

    renderError() {
        const { error } = this.state;
        if(error === null) { return null } else {
            return (<p className='error'>{this.errorMap.get(error)}</p>);
        }
    }

    render() {
        const { location } = this.state;
        return (
            <div className="home">
                <h1 className="title">Restaurant Finder</h1>
                <div className="location-container">
                    <button className="near-me"
                            onClick={this.detectLocation}>
                        <img src={NavigateIcon} />
                        Find near me
                    </button>
                    <p className="or-divider">OR</p>
                    <div className="input-container">
                        <input type="text"
                               name="location"
                               value={location}
                               placeholder="Enter your location"
                               ref={node => this.input = node}
                               onChange={this.locationChange}
                               onKeyUp={this.locationKeyUp} />
                        <button onClick={this.searchLocation}>
                            <img src={SearchIcon} />
                        </button>
                    </div>
                    {this.renderError()}
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    google: PropTypes.object,
    updateLocation: PropTypes.func,
    resetError: PropTypes.func
};

export default Home;

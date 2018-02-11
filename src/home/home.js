import React, { Component } from 'react';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.detectLocation = this.detectLocation.bind(this);
        this.locationChange = this.locationChange.bind(this);
        this.locationKeyUp = this.locationKeyUp.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
        this.handleGeocoder = this.handleGeocoder.bind(this);
        this.state = {
            location: ''
        }
    }

    detectLocation() {
        const { updateLocation } = this.props;
        navigator.geolocation.getCurrentPosition(position => {
            updateLocation(position.coords.latitude, position.coords.longitude);
        });
    }

    locationChange(event) {
        this.setState({ location: event.target.value });
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

    handleGeocoder(result, status) {
        const { google, updateLocation } = this.props;
        if (status === google.maps.GeocoderStatus.OK) {
            updateLocation(result[0].geometry.location.lat(), result[0].geometry.location.lng());
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    }

    render() {
        const { location } = this.state;
        return (
            <div className="home">
                <h1 className="title">Restaurant Finder</h1>
                <div className="location-container">
                    <button className="near-me"
                            onClick={this.detectLocation}>Find near me</button>
                    <p className="or-divider">OR</p>
                    <div className="input-container">
                        <input type="text"
                               name="location"
                               value={location}
                               placeholder="Enter your location"
                               onChange={this.locationChange}
                               onKeyUp={this.locationKeyUp} />
                        <button onClick={this.searchLocation}>Search</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

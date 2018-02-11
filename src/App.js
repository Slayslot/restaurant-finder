import React, { Component } from 'react';
import Home from './home/home';
import axios from 'axios';
import { GoogleApiWrapper } from 'google-maps-react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.updateLocation = this.updateLocation.bind(this);
        this.state = {
            lat: null,
            long: null,
            zomato: null
        }
    }

    updateLocation(lat, long) {
        const config = {
            headers: {
                'user-key': '45616f457a0fa3271f0dec21a1bd826c'
            }
        };
        axios.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${long}`, config)
            .then((response) => {
                this.setState({ lat, long, zomato: response.data });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const { lat, long } = this.state;
        if(lat === null && long === null) {
            return (
                <Home updateLocation={this.updateLocation} google={this.props.google}/>
            );
        } else {
            return (
                <div>{this.state.lat}, {this.state.long}</div>
            )
        }
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAAdpK2bM1BNLlbBxRR86P4DLgGWWmTZt0'
})(App);

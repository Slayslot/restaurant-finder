import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './map.css';

class Map extends Component {
    componentDidMount() {
        const { google, lat, long, zomato } = this.props;
        const maps = google.maps;
        const mapConfig = Object.assign({}, {
            center: { lat: lat, lng: long },
            zoom: 14,
        });
        const newMap = new maps.Map(this.map, mapConfig);
        const newMarker = new maps.Marker({
            position: { lat: lat, lng: long },
            map: newMap,
            icon: { url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-32.png'}
        });
        newMarker.setMap(newMap);
        zomato.nearby_restaurants.forEach(({ restaurant }) => {
            const { featured_image,
                name,
                cuisines,
                currency,
                average_cost_for_two,
                has_online_delivery,
                has_table_booking,
                is_delivering_now,
                location,
                menu_url,
                photos_url,
                price_range,
                user_rating } = restaurant;
            const { address, latitude, longitude } = location;
            const { aggregate_rating, rating_color, rating_text, votes } = user_rating;
            const contentString = `<div class="restaurant-content">
                <img src='${featured_image}'>
                <h1 id="firstHeading" class="firstHeading">${name}</h1>
                <div id="bodyContent">
                <p>Cuisines: ${cuisines}</p>
                <p>Average cost for two: ${currency}${average_cost_for_two}</p>
                <p>Online Deliver: ${has_online_delivery ? 'yes' : 'no'}</p>
                <p>Table Booking: ${has_table_booking ? 'yes': 'no'}</p>
                <p>Delivering now: ${is_delivering_now ? 'yes': 'no'}</p>
                <p>Address: ${address}</p>
                <p><a target="_blank" href="${menu_url}">Open Menu</a></p>
                <p><a target="_blank" href="${photos_url}">Open Photos</a></p>
                <p>Price Range: ${price_range}</p>
                <p>Rating: ${aggregate_rating} ${rating_color} ${rating_text} ${votes}</p>
                </div>
                </div>`;

            var restaurantInfo = new maps.InfoWindow({
                content: contentString
            });

            const restaurantMarker = new maps.Marker({
                position: { lat: Number(latitude), lng: Number(longitude) },
                map: newMap,
                title: name,
                icon: { url: 'http://www.myiconfinder.com/uploads/iconsets/32-32-6096188ce806c80cf30dca727fe7c237.png' }
            });
            restaurantMarker.addListener('click', () => {
                restaurantInfo.open(newMap, restaurantMarker);
            });
            restaurantMarker.setMap(newMap);
        });
    }

    render() {
        const { reset } = this.props;
        return (
            <div className="map-view">
                <button onClick={reset}>Go back</button>
                <div id="map" ref={node => this.map = node}></div>
            </div>
        );
    }
}

Map.propTypes = {
    reset: PropTypes.func,
    google: PropTypes.object,
    lat: PropTypes.number,
    long: PropTypes.number,
    zomato: PropTypes.object
};

export default Map;

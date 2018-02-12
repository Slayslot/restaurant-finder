import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BackArrow from '../images/back-arrow.svg';
import Tick from '../images/checked.svg';
import Cross from '../images/cross.svg';
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
                location,
                menu_url,
                photos_url,
                user_rating } = restaurant;
            const { address, latitude, longitude } = location;
            const { aggregate_rating, rating_color, votes } = user_rating;
            const contentString = `<div class="restaurant-content">
                <img class="restaurant-background" src='${featured_image}?v=${Math.random()}'>
                <h1 class="restaurant-name">${name}</h1>
                <div class="rating">
                    <div class="rating-box" style="background-color: #${rating_color}">
                        ${aggregate_rating}<span>/5</span>
                    </div>
                    <span>${votes} votes</span>
                </div>
                <div class="main-content">
                <div class="actions">
                    <a target="_blank" href="${menu_url}">Open Menu</a>
                    <a target="_blank" href="${photos_url}">Open Photos</a>
                </div>
                <div class="availability">
                    <p>
                       <img src="${has_online_delivery ? Tick : Cross}" />
                       <span>Online Deliver</span>
                    </p>
                    <p>
                       <img src="${has_online_delivery ? Tick : Cross}" />
                       <span>Table Booking</span>
                    </p>
                    <p>
                       <img src="${has_online_delivery ? Tick : Cross}" />
                       <span>Delivering now</span>
                    </p>
                </div>
                <h3>Cuisines</h3>
                <p>${cuisines}</p>
                <h3>Average cost</h3>
                <p>${currency}${average_cost_for_two} for two people(approx)</p>
                <h3>Address</h3>
                <p>${address}</p>
                </div>
                </div>`;

            var restaurantInfo = new maps.InfoWindow({
                content: contentString,
                maxWidth: 350,
            });

            const restaurantMarker = new maps.Marker({
                position: { lat: Number(latitude), lng: Number(longitude) },
                map: newMap,
                title: name,
                icon: { url: 'https://i.imgur.com/LbW1kr8.png' }
            });
            restaurantMarker.addListener('click', () => {
                restaurantInfo.open(newMap, restaurantMarker);
            });
            maps.event.addListener(newMap, 'click', () => {
                restaurantInfo.close();
            });
            maps.event.addListener(restaurantInfo, 'domready', () => {
                const iwOuters = document.querySelectorAll('.gm-style-iw');
                iwOuters.forEach((iwOuter) => {
                    const iwBackground = iwOuter.previousSibling;
                    const iwCloseBtn = iwOuter.nextElementSibling;

                    iwBackground.children[1].style.display = 'none';
                    iwBackground.children[3].style.display = 'none';
                    iwBackground.children[2].querySelector('div').children[0].style.boxShadow = 'rgba(72, 181, 233, 0.6) 0px 1px 6px';
                    iwBackground.children[2].querySelector('div').children[0].style.zIndex =  '1';
                    iwCloseBtn.style.opacity = '1';
                    iwCloseBtn.style.right = '38px';
                    iwCloseBtn.style.top = '3px';
                    iwCloseBtn.style.border = '5px solid #424242';
                    iwCloseBtn.style.borderRadius = '13px';
                    iwCloseBtn.style.transition = 'opacity 100ms ease-in-out';
                });
            });
            restaurantMarker.setMap(newMap);
        });
    }

    render() {
        const { reset } = this.props;
        return (
            <div className="map-view">
                <header>
                    <div className='back-container' onClick={reset}>
                        <img src={BackArrow} alt='back arrow' />
                        <span>back</span>
                    </div>
                </header>
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

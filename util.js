import { Circle, Popup } from "react-leaflet";
import React from "react";
import numeral from "numeral";
import './components/Map.css'

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      multiplier: 200,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 200,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 200,
    },

    vaccinations: {
        hex:"#7dd71d",
        multiplier: 200,
    }
  };

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    });

    return sortedData;
}

//formats numbers

export const prettyPrintStat = (stat) =>
  `${numeral(stat).format("0,0")}`;


//Draw circles on map with interactive tooltop
export const showDataonMap = (data, casesType ='cases') => (
data.map(country => (
    <Circle center = {[country.countryInfo.lat, country.countryInfo.long]}
    fillOpacity ={0.4}
    color={casesTypeColors[casesType].hex}
    fillColor={casesTypeColors[casesType].hex}
    radius={
        Math.sqrt(country[casesType]) * (casesTypeColors[casesType].multiplier)}>
            <Popup>

                <div className = "info-container">
                    <div className = "info-flag" style ={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                    <div className = "info-name">{country.country}</div>
                    <div className = "info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className = "info-recovered">Recoveries: {numeral(country.recovered).format("0,0")}</div>
                    <div className = "info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>

            </Popup>
        </Circle>
))
);


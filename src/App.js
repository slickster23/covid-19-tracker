import './App.css';
import React, {useEffect, useState} from 'react';
import { Select, FormControl, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table'
import './Table.css'
import { prettyPrintStat, sortData } from './util';
import LineGraph from './components/LineGraph'
import "leaflet/dist/leaflet.css"




function App() {

  //STATE = How to write variable in React

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})//center of the map
  const [mapZoom, setMapZoom] = useState(3); //how far back to zoom
  const [mapCountries, setMapCountries] = useState([]);
  const [vaccineNum, setVaccineNum] = useState({});
  

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data)
    })


    
  }, []);

  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true")
    .then(response => response.json())
    .then((data) => {
      setVaccineNum(data[0].total)
    })


    
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;//grabs selected value from drop down menu


    setCountry(countryCode);//changes option displayed on Menu

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    

    fetch (url)
    .then (response => response.json())
    .then (data => {
      setCountry(countryCode);

      const url3 = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1&fullData=true' : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=1&fullData=true`

       fetch(url3)
          .then((response) => response.json())
          .then ((data) => {
            if (countryCode === 'worldwide') {
              setVaccineNum(data[0].total)
              console.log(countryCode, data[0].total)
            } else {
              setVaccineNum(data.timeline[0].total)
              console.log(countryCode, data.timeline[0].total)
            }
              

          })

          
          
      //All of the data from country response
      setCountryInfo(data);

      if (countryCode === 'worldwide') {
        setMapCenter({lat: 34.80746, lng: -40.4796})
      } else {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      }
       
     setMapZoom(4)

    });

   
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    //https://disease.sh/v3/covid-19/all

  };



  //UseEffect = Runs code based on given condition

  useEffect(() => {

    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then ((response)=> response.json())
      .then((data)=> {

        //map returns an array
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
        

      });
    };

    getCountriesData()

  }, [countries]);

  return (
    <div className="app">
      
      {/*Header*/}
      {/*Title, Input DropDown List*/}

      <div className="app__left">
      <div className="app__header">
       <h1> COVID-19 TRACKER</h1>
       <FormControl className="app__dropdown">
        <Select variant = "outlined" onChange={onCountryChange} value = {country}>
          {/*Loop through all countries and show a dropdown list of option*/}
          <MenuItem value = "worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))};
          </Select>

      </FormControl>
        </div>

        
      {/*InfoBoxes*/}
      {/*InfoBoxes*/}
      {/*InfoBoxes*/}

      
     
      <div className="app__stats">
        <InfoBox isRed  active = {casesType === "cases"} onClick = {(e) => setCasesType("cases")} title = "Confirmed Cases (Today)" cases = {prettyPrintStat(countryInfo.todayCases) } total = {prettyPrintStat(countryInfo.cases)}></InfoBox>
        <InfoBox active = {casesType === "recovered"} onClick = {(e) => setCasesType("recovered")} title = "Recovered (Today)" cases = {prettyPrintStat(countryInfo.todayRecovered)} total = {prettyPrintStat(countryInfo.recovered)}></InfoBox>
        <InfoBox isRed active = {casesType === "deaths"} onClick = {(e) => setCasesType("deaths")} title = "Deaths (Today)" cases = {prettyPrintStat(countryInfo.todayDeaths)} total = {prettyPrintStat(countryInfo.deaths)}></InfoBox>
        <InfoBox active = {casesType === "vaccinations"} title = "Vaccinations" cases = {prettyPrintStat(vaccineNum)} total = {prettyPrintStat(vaccineNum)}></InfoBox>
      </div>


      {/*Map*/}
      <Map countries = {mapCountries} center = {mapCenter} zoom ={mapZoom} casesType = {casesType} />
    </div>

    <Card className="app__right">
      <CardContent className = "stats">
         {/*Table*/}
        <h3>Total Cases by Country</h3>
        <Table countries = {tableData}></Table>
        <h3 className = "graph__title">Worldwide {casesType} </h3>
         {/*Graph*/}
      <LineGraph className= "app__graph" casesType = {casesType}/>
      </CardContent>
     
     
    </Card>

      </div>
      
  );
}

export default App;

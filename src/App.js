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

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;//grabs selected value from drop down menu

    console.log(countryCode);

    setCountry(countryCode);//changes option displayed on Menu

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch (url)
    .then (response => response.json())
    .then (data => {
      setCountry(countryCode);

      //All of the data from country response
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
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
        <InfoBox isRed  active = {casesType === "cases"} onClick = {(e) => setCasesType("cases")} title = "Coronavirus Cases (Today)" cases = {prettyPrintStat(countryInfo.todayCases) } total = {prettyPrintStat(countryInfo.cases)}></InfoBox>
        <InfoBox active = {casesType === "recovered"} onClick = {(e) => setCasesType("recovered")} title = "Recovered (Today)" cases = {prettyPrintStat(countryInfo.todayRecovered)} total = {prettyPrintStat(countryInfo.recovered)}></InfoBox>
        <InfoBox isRed active = {casesType === "deaths"} onClick = {(e) => setCasesType("deaths")} title = "Deaths (Today)" cases = {prettyPrintStat(countryInfo.todayDeaths)} total = {prettyPrintStat(countryInfo.deaths)}></InfoBox>

      </div>


      {/*Map*/}
      <Map countries = {mapCountries} center = {mapCenter} zoom ={mapZoom} casesType = {casesType} />
    </div>

    <Card className="app__right">
      <CardContent className = "stats">
         {/*Table*/}
        <h3>Live Cases by Country</h3>
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

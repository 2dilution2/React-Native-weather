import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import API_KEY from './keys/apiKey'
import { Fontisto } from '@expo/vector-icons';

const {width:SCREEN_WIDTH} = Dimensions.get("window");

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city , setCity] = useState("Loading...");
  const [days , setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync(); 
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps:false}
    )
    setCity(location[0].district);

    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() =>{
    getWeather();
  }, []) 

  const activityIndicatorSize = Platform.OS === 'ios' ? 'large' : 100;

  return (
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView 
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator 
                size={activityIndicatorSize}
              />
            </View>
          ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Text style={styles.temp2}>℃</Text>
                </View>
                <Fontisto name={icons[day.weather[0].main]} size={50} color="#51AB47" />
                <Text style={styles.desc}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            ))            
          )} 
        </ScrollView>
        <StatusBar style='light'/>
      </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor:'#1E5A3D'
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: '#51AB47',
    fontSize: 68,
    fontWeight: "500",
  },
  day: {
    width:SCREEN_WIDTH,
    alignItems: 'left',
    marginLeft: 10,
  },
  temp: {
    color: '#51AB47',
    fontSize: 140,
  },
  temp2: {
    color: '#51AB47',
    fontSize: 100,
  },
  desc: {
    color: '#51AB47',
    marginTop: -10,
    fontSize: 60,
  },
  tinyText: {
    color: '#51AB47',
    fontSize: 30,
  },
})


import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import * as Font from 'expo-font';
import { Audio } from 'expo-av'; 
import LottieView from "lottie-react-native";

import Loading from '../components/loading';

const API_KEY = '57799ca61842887433a057c79ddc334c';

export default class Main extends Component {
  //состояния
  state = {
    location: null,
    weather: null,
    fontLoaded: false,
  };

  // Метод для воспроизведения музыки по типу погоды
  playMusic = (weatherCondition) => {
    let soundUri = null;
    switch (weatherCondition) {
      case 'Clear':
        soundUri = require('../assets/audio/sun.mp3');
        break;
      case 'Clouds':
        soundUri = require('../assets/audio/clouds.mp3');
        break;
      case 'Rain':
        soundUri = require('../assets/audio/rain.mp3');
        break;
      case 'Drizzle':
        soundUri = require('../assets/audio/drizzle.mp3');
        break;
      case 'Thunderstorm':
        soundUri = require('../assets/audio/thunderstorm.mp3');
        break;
      case 'Snow':
        soundUri = require('../assets/audio/snow.mp3');
        break;
      case 'Mist':
        soundUri = require('../assets/audio/mist.mp3');
        break;
      default:
        soundUri = require('../assets/audio/default.mp3');
    }
    
    if (soundUri) {
      const soundObject = new Audio.Sound();
      try {
        soundObject.loadAsync(soundUri).then(() => {
          soundObject.playAsync();
        });
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };
  
  async componentDidMount() {
    //загрузка шрифтов
    await Font.loadAsync({
      'HomeRem': require('../assets/fonts/HomeRem.ttf'),
      'Grass': require('../assets/fonts/GrassGarden.otf')
    });

    this.setState({ fontLoaded: true });
    
    this.getLocation();
  }
  //получение геолокации
  getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: 5 });
      this.setState({ location }, () => {
        this.getWeather();
      });
    } catch (error) {
      console.error('Error getting location:', error.message);
      Alert.alert('Location Error', error.message);
    }
  };
  //получение погоды
  getWeather = async () => {
    const { location } = this.state;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`
      );

      this.setState({ weather: response.data }, () => {
        // Вызов метода воспроизведения музыки после получения погоды
        this.playMusic(response.data.weather[0].main);
      });
    } catch (error) {
      console.error('Error getting weather:', error.message);
      console.error('API Response:', error.response.data);
      Alert.alert('Weather Error', error.message);
    }
  };

  //показ изображения по типу погоды
  renderWeatherImage = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return <LottieView source={require("../assets/gif/sun.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Clouds':
        return <LottieView source={require("../assets/gif/clouds.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Rain':
      case 'Drizzle':
        return <LottieView source={require("../assets/gif/rain.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Thunderstorm':
        return <LottieView source={require("../assets/gif/thunderstorm.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Snow':
        return <LottieView source={require("../assets/gif/snow.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Mist':
        return <LottieView source={require("../assets/gif/mist.json")} style={styles.weatherImage} autoPlay loop />;
      default:
        return <LottieView source={require("../assets/gif/else.json")} style={styles.weatherImage} autoPlay loop />; 
    }
  };

  render() {
    const { location, weather, fontLoaded } = this.state;

    if (!fontLoaded) {
      return <Loading />;
    }

    return (
      <View style={styles.container}>
        {location ? (
          <View>
            {weather ? (
              <View style={styles.weather}>
                <Text style={[styles.text, styles.FirstText]}>{weather.name}</Text>
                <Text style={styles.text}>{Math.round(weather.main.temp - 273.15)} °C</Text>
                <Text style={[styles.text, styles.lastText]}>{weather.weather[0].description}</Text>
                <View style={styles.weatherImageContainer}>
                  {this.renderWeatherImage(weather.weather[0].main)}
                </View>
              </View>
            ) : (
              <Loading />
            )}
          </View>
        ) : (
          <Loading />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9cd6f7',
    
  },
  weather:{
    paddingBottom:110,
  },
  text:{
    color:'white',
    fontFamily:'Grass',
    fontSize:35,
    textAlign: 'center',
    marginBottom:10
  },
  FirstText:{
    marginTop:60
  },
  lastText: {
    marginBottom: 0,
  },
  weatherImageContainer: {
    alignItems: 'center', 
  },
  weatherImage: {
    width: 300,
    height: 300,
    margin:0,
    bottom: 50,
    resizeMode: 'contain',
    alignItems:'center',
    justifyContent:'center'
  },
});

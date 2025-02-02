import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import * as Font from 'expo-font';
import LottieView from "lottie-react-native";
import Loading from '../components/loading';

const API_KEY = '57799ca61842887433a057c79ddc334c';

export default class Add extends Component {
  //состояния
  state = {
    location: null,
    weather: null,
    fontLoaded: false,
    modalVisible: false,
    cities: [],
    selectedCity: '',
    searchText: '',
  };

  async componentDidMount() {
    //загрузка шрифтов
    await Font.loadAsync({
      'HomeRem': require('../assets/fonts/HomeRem.ttf'),
      'Grass': require('../assets/fonts/GrassGarden.otf')
    });
  
    this.setState({ fontLoaded: true });
  
    // города
    const cities = [
      'Moscow', 'St. Petersburg', 'Yekaterinburg', 'Kazan', 'Novosibirsk',
      'Vladivostok', 'Sochi', 'Krasnodar', 'Krasnoyarsk', 'Ufa', 'Perm',
      'Volgograd', 'Omsk', 'Rostov-on-Don', 'Samara', 'Chelyabinsk',
      'Ulyanovsk', 'Irkutsk', 'Tyumen', 'Kaliningrad', 'Tomsk', 'Astrakhan',
      'Barnaul', 'Ulan-Ude', 'Voronezh', 'Murmansk', 'Yaroslavl', 'Saratov',
      'Khabarovsk', 'Magnitogorsk', 'Tver', 'Kemerovo', 'Ryazan', 'Tula',
      'Ivanovo', 'Belgorod', 'Surgut', 'Volzhsky', 'Izhevsk', 'Bratsk',
      'Vladimir', 'Chita', 'Arkhangelsk', 'Kursk', 'Kirov', 'Stavropol',
      'Nizhny Tagil', 'Sevastopol', 'Bryansk', 'Armavir', 'Penza', 'Lipetsk',
      'Orenburg', 'Naberezhnye Chelny', 'Kurgan', 'Kaluga', 'Cheboksary', 'Orel',
      'Yakutsk', 'Togliatti', 'Kostroma', 'Vladikavkaz', 'Makhachkala', 'Tambov',
      'Sterlitamak', 'Nizhny Novgorod', 'Blagoveshchensk', 'Krymsk', 'Petrozavodsk',
      'Biysk', 'Yoshkar-Ola', 'Elista', 'Balashikha', 'Syktyvkar', 'Cherepovets',
      'Grozny', 'Kamensk-Uralsky', 'Smolensk', 'Orekhovo-Zuevo', 'Novorossiysk',
      'Dzerzhinsk', 'Kopeysk', 'Zhukovsky', 'Engels', 'Mytishchi', 'Shakhty',
      'Elets', 'Abakan', 'Kostanai', 'Salavat', 'Krasnogorsk', 'Pskov'
  ];
    this.setState({ cities });
  }
  //поиск городов
  handleSearchInputChange = (text) => {
    this.setState({ searchText: text });
  }

  // отображение модального окна
  showCityPickerModal = () => {
    this.setState({ modalVisible: true });
  };

  // закрытие модального окна
  hideCityPickerModal = () => {
    this.setState({ modalVisible: false });
  };

  // Метод для обработки выбора города
  onCityChange = async (selectedCity) => {
    const cityInfo = await this.getCityInfo(selectedCity);
    if (cityInfo) {
      const { latitude, longitude } = cityInfo;
      this.setState({ selectedCity: selectedCity }, () => {
        this.getWeather(latitude, longitude);
        this.hideCityPickerModal();
      });
    } else {
      console.error('Город не найден:', selectedCity);
      Alert.alert('City Error', 'Город не найден');
    }
  };
  // получение координат города
  getCityInfo = async (cityName) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`);
      if (response.data && response.data.length > 0) {
        const city = response.data[0];
        return { name: city.display_name.split(',')[0], latitude: city.lat, longitude: city.lon };
      } else {
        console.error('Город не найден:', cityName);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при получении информации о городе:', error);
      return null;
    }
  };
  //получение погоды
  getWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
  
      this.setState({ weather: response.data });
    } catch (error) {
      console.error('Error getting weather:', error.message);
      console.error('API Response:', error.response.data);
      Alert.alert('Weather Error', error.message);
    }
  };
  // показ изоюражения в зависимости от типа погоды
  renderWeatherImage = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return <LottieView source={require("../assets/gif/sun.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Clouds':
        return <LottieView source={require("../assets/gif/clouds.json")} style={styles.weatherImage} autoPlay loop />;
      case 'Rain':
        return <LottieView source={require("../assets/gif/rain.json")} style={styles.weatherImage} autoPlay loop />;
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
    const { location, weather, fontLoaded, modalVisible, selectedCity } = this.state;
  
    if (!fontLoaded) {
      return <Loading />;
    }
  
    return (
      <View style={styles.container}>
        
        <View style={styles.weather}>
          {weather && (
            <>
              <Text style={styles.text}>{weather.name}</Text>
              <Text style={styles.text}>{Math.round(weather.main.temp - 273.15)} °C</Text>
              <Text style={styles.text}>{weather.weather[0].description}</Text>
              <View style={styles.weatherImageContainer}>
                {this.renderWeatherImage(weather.weather[0].main)}
              </View>
            </>
          )}
        </View>
        <TouchableOpacity onPress={this.showCityPickerModal}>
          <Text style={styles.buttonText}>Choice City</Text>
        </TouchableOpacity>
  
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.hideCityPickerModal();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.choice}>Choice City</Text>
              <TextInput
                style={styles.input}
                onChangeText={this.handleSearchInputChange}
                value={this.state.searchText}
                placeholder="Enter the city name..."
              />

              
              <ScrollView style={styles.cityListContainer}>
                {this.state.cities
                  .filter(city => city.toLowerCase().includes(this.state.searchText.toLowerCase()))
                  .map(city => (
                    <TouchableOpacity
                      key={city}
                      onPress={() => this.onCityChange(city)}
                      style={styles.cityItem}
                    >
                      <Text style={styles.cityItem}>{city}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              <TouchableOpacity onPress={() => this.hideCityPickerModal()}>
                <Text style={styles.close}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    position:'absolute',
    paddingBottom:35,
  },
  cityListContainer: {
    flex: 1, 
    maxHeight: '80%', 
    marginBottom: 10,
    backgroundColor: 'white',
    
    
  },
  cityItem:{
    fontSize:28,
    fontFamily: 'Grass',
    color:'#4CA700',


  },
  input:{
    color:'#4CA700',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 35,
    color: 'white',
    fontFamily: 'Grass',
    marginTop:600,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
    
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    width: '80%', 
    height: '80%', 
    elevation: 5,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: '#d2d2d2',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  text: {
    color: 'white',
    fontFamily: 'Grass',
    fontSize: 35,
    textAlign: 'center',
    marginBottom: 10,
  },
  choice:{
    fontSize:30,
    color:'#4CA700',
    fontFamily: 'Grass',
  },
  close:{
    color:'#4CA700',
    textAlign:'center',
    fontSize:40,
    marginTop:5,
    fontFamily: 'Grass'

  }
});

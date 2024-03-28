import React from 'react'; 
import {StyleSheet, Text, View} from 'react-native' 
 
function Loading (){ 
    return <View style={styles.container}> 
        <Text style={styles.text}>Weather app</Text> 
    </View> 
}
 
const styles = StyleSheet.create({ 
    container:{ 
        flex: 1, 
        justifyContent: 'center',  
        alignItems: 'center' 
    }, 
    text:{ 
        color: 'white', 
        fontSize: 50,
        fontFamily:'Grass'
    } 
})

export default Loading;
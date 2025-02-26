import React, { useEffect } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { Images } from "../constants/";
import { useTheme, Button, Text } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import Constants from 'expo-constants';
import { useFonts } from "expo-font";

const app_info = `
Version: 0.2.1a (alpha)
Date: 15-10-2024
Devs: Mohikshit Ghorai, Pritam Das, Suparno Saha

Initially made for #HackSynthesis 2024 hackathon at UEM, Newton, Kolkata
`.trim();
const disclaimer = `
This app is currently in alpha stage. All features are not available yet!
Any transcript/summary/flashcards etc, you add/generate are NOT saved.
We are sorry for the inconvenience!
`.trim();

const COLOR_5_text1      = 'rgb(214, 192, 255)';
const COLOR_6_text2      = 'rgb(187, 157, 241)';
const COLOR_4_btnText    = 'rgb(159, 104, 228)';
const COLOR_1_extraBtn   = 'rgb(119, 17, 209)';
const COLOR_0_bgGradient = 'rgb(119, 17, 209)';
const COLOR_2_btnGradA   = 'rgb(71, 10, 125)';  // (1-noiseOpacity)*Color0 | prev: 'rgb(52, 10, 89)';
const COLOR_3_btnGradB   = 'rgb(28, 4, 50)';    // 0.4*Color2              | prev: 'rgb(27, 0, 43)';

export default function WelcomeScreen({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    useFonts({
        'Poppins': require('../assets/fonts/Poppins.ttf'),
      });
    

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
    return (
        <LinearGradient
            colors={[COLOR_0_bgGradient, 'black','black']}
            style={styles.container}
        >
            <Image
                style={styles.noisyBackgroundFilter}
                source={Images.noisyBackground}
                resizeMode="contain"
            />
            <Image
                style={styles.image}
                source={Images.landingPageImage}
                resizeMode="contain"
            />
            <View style={styles.bottomContainer}>

                <Text style={styles.titleText}>acadz</Text>
                <Text style={styles.subtitleText}>
                    Your <Text style={[styles.subtitleText, { fontWeight: 'bold', fontStyle: 'italic' }]}>
                        AI-powered study companion
                    </Text> - Let me handle the mess, while you focus on <Text style={[styles.subtitleText, { fontWeight: 'bold' }]}>learning</Text>!
                </Text>
                <Text style={styles.featuresText}>
                    ✔ Record lectures seamlessly{'\n'}
                    ✔ Get instant transcripts & summaries{'\n'}
                    ✔ AI-powered flashcards for revision{'\n'}
                    ✔ Discover relevant YouTube videos
                </Text>
                <View style={styles.extraButtonContainer}>
                    
                    <Button
                        mode="text"
                        textColor={COLOR_1_extraBtn}
                        labelStyle={{textDecorationLine: 'underline'}}
                        onPress={() => Alert.alert('Disclaimer', disclaimer)}>
                        Disclaimer</Button>

                    <Button
                        mode="text"
                        textColor={COLOR_1_extraBtn}
                        labelStyle={{textDecorationLine: 'underline'}}
                        onPress={() => Alert.alert('App Info', app_info)}>
                        App Info</Button>
                </View>

                <LinearGradient
                    start={{x: 0, y: 0.5}} end={{x: 0.9, y: 0.5}}
                    colors={[COLOR_2_btnGradA, COLOR_3_btnGradB]}
                    style={styles.button}
                >
                    <Button
                        icon="chevron-right"
                        mode="text"
                        style={{width: '100%'}}
                        labelStyle={{paddingVertical: 6}}
                        textColor={COLOR_4_btnText}
                        onPress={() => navigation.navigate("Home")}>
                        Continue to Dashboard
                    </Button>
                </LinearGradient>
                
            </View>
        </LinearGradient>
    );
}


const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight + 24,
        paddingBottom: 24,
    },

    image: {
        borderWidth: 1,
        flexShrink: 1,
        maxWidth: '65%',
    },
    noisyBackgroundFilter: {
        position: 'absolute',
        opacity: 0.4,
        width: '125%',
        height: '125%',
        top: '-6%',
        left: 0,
        right: 0,
        bottom: 0,
        resizeMode: 'stretch', 
          
    },

    bottomContainer: {
        height: '67%',
        paddingHorizontal: 24,
        alignSelf:'stretch',
    },
    
    titleText: {
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        fontSize: 50,
        marginTop: 12,
        marginHorizontal: 12,
        color: COLOR_5_text1,
    },

    subtitleText: {
        fontSize: 18,
        marginHorizontal: 12,
        color: COLOR_6_text2,
    },
    featuresText: {
        fontSize: 14,
        marginHorizontal: 24,
        marginTop: 16,
        color: COLOR_6_text2,
        flex:1,  
    },

    extraButtonContainer: {
        flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', gap: 10, marginBottom: 10
    },

    button: {
        borderRadius: 100,
        alignSelf: 'stretch',
    }
});
import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotebookScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const { path } = route.params;
    console.log(path);

    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState(null);
    const [ytsugg, setYtsugg] = useState(null);


    useEffect(() => {
        loadDatas();

        // navigation.setOptions({
        //     headerLeft: () => (<IconButton
        //         icon='arrow-left'
        //         onPress={navigation.goBack}
        //         iconColor={theme.colors.onPrimaryContainer}
        //     />),
        //     headerRight: () => (<IconButton
        //         icon="dots-vertical"
        //         // onPress={clearStorage}
        //         iconColor={theme.colors.onPrimaryContainer}
        //     />)
        // });
    }, [navigation]);

    const loadDatas = async () => {
        try {
            // const data = await AsyncStorage.getItem(path);
            // const parsedData = data ? JSON.parse(data) : {};
            // if (!('transcript' in parsedData)) return;

            // setTranscript(parsedData.transcript);
            // if ('summary' in parsedData) {
            //     setSummary(parsedData.summary);
            // }
            // if ('flashcards' in parsedData) {
            //     setFlashcards(parsedData.flashcards);
            // }
            // if ('ytsugg' in parsedData) {
            //     setYtsugg(parsedData.ytsugg);
            // }
            const trans = await AsyncStorage.getItem(path + '/transcript');
            setTranscript(trans);
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <IconButton
                    icon="microphone-variant"
                    size={42}
                    onPress={() => navigation.navigate("RecordLecture", { path: path })}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
                <IconButton
                    icon="line-scan"
                    size={42}
                    onPress={() => navigation.navigate("ScanDocument", { path: path })}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
                <IconButton
                    icon="youtube"
                    size={42}
                    onPress={() => navigation.navigate("YoutubeTranscript", { path: path })}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
                <IconButton
                    icon="file-pdf-box"
                    size={42}
                    onPress={() => navigation.navigate("UploadDocument", { path: path })}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
            </View>

            <View style={styles.otherContainer}>
                {!transcript &&
                    <Text style={styles.helpText}>
                        Choose any of the above options to create transcript/content
                        {'\n'}{'\n'}
                        Then you can use it to generate Summary, Flashcards, Youtube Suggestions
                    </Text>
                }
                {transcript &&
                    <Button
                        mode="contained"
                        style={styles.button1}
                        onPress={() => {
                            navigation.navigate('Transcript', { path: path });
                        }}>
                        Transcript
                    </Button>
                }
                {transcript && summary &&
                    <Button
                        mode="contained"
                        style={styles.button1}
                        onPress={() => {
                            navigation.navigate('Summary', { path: path });
                        }}>
                        Summary
                    </Button>
                }
                {transcript && flashcards &&
                    <Button
                        mode="contained"
                        style={styles.button1}
                        onPress={() => {
                            navigation.navigate('Flashcards', { path: path });
                        }}>
                        Flashcards
                    </Button>
                }
                {transcript && ytsugg &&
                    <Button
                        mode="contained"
                        style={styles.button1}
                        onPress={() => {
                            navigation.navigate('YoutubeSuggestions', { path: path });
                        }}>
                        Youtube Suggestions
                    </Button>
                }
                {transcript && !summary &&
                    <Button
                        mode="outlined"
                        style={styles.button2}
                        onPress={() => {
                            navigation.navigate('Summary', { path: path });
                        }}>
                        Generate Summary
                    </Button>
                }
                {transcript && !flashcards &&
                    <Button
                        mode="outlined"
                        style={styles.button2}
                        onPress={() => {
                            navigation.navigate('Flashcards', { path: path });
                        }}>
                        Generate Flashcards
                    </Button>
                }
                {transcript && !ytsugg &&
                    <Button
                        mode="outlined"
                        style={styles.button2}
                        onPress={() => {
                            navigation.navigate('YoutubeSuggestions', { path: path });
                        }}>
                        Get Youtube Suggestions
                    </Button>
                }
            </View>
        </View >
    );
};

export default NotebookScreen;

const createStyles = theme => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 5,
        paddingTop: 15,
        paddingHorizontal: 15,
    },
    otherContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 15,
        paddingTop: 40,
        paddingHorizontal: 14,
        alignItems: 'stretch',
    },
    button1: {
        marginHorizontal: 34,
    },
    button2: {
        marginHorizontal: 34,
        backgroundColor: '#99999922'
    },
    helpText: {
        color: theme.colors.onTertiary,
        paddingHorizontal: 8,
        textAlign: 'center',
    }
});

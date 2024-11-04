import { Alert, BackHandler, FlatList, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Images } from "../constants/";
import { TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, IconButton, useTheme } from "react-native-paper";
import AddNewDialog from "../components/AddNewDialog";
import ItemType from "../constants/ItemType";

const EmptyContent = ({ openDialog }) => {
    const theme = useTheme();
    const styles = createEmptyContentStyles(theme);
    return <View>
        <Image
            style={styles.image}
            source={Images.noFiles}
            resizeMode="contain"
            tintColor={theme.colors.secondary}
        />
        <Text style={styles.instructionText}>
            Click on the buttons to Add a NoteBook or a Group.
        </Text>
        <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    onPress={() => {
                        openDialog(ItemType.NOTEBOOK);
                    }}
                    activeOpacity={0.7}
                    style={styles.button}
                >
                    <Image
                        style={styles.icon}
                        source={Images.notebookCreate}
                        resizeMode="contain"
                        tintColor={theme.colors.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Add Notebook</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    onPress={() => {
                        openDialog(ItemType.GROUP);
                    }}
                    activeOpacity={0.7}
                    style={styles.button}
                >
                    <Image
                        style={styles.icon}
                        source={Images.groupCreate}
                        resizeMode="contain"
                        tintColor={theme.colors.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Add Group</Text>
            </View>
        </View>
    </View>;
}

const FilledContent = ({ items, onItemPress, openDialog }) => {
    // console.log('filled content updated with items: ', items);
    const theme = useTheme();
    const styles = createFilledContentStyles(theme);
    return <View style={styles.container}>
        <FlatList
            data={items}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    <TouchableOpacity
                        onPress={() => onItemPress(item)}
                        activeOpacity={0.7}
                        style={styles.touchableContainer}
                    >
                        <IconButton
                            icon={item.type === ItemType.NOTEBOOK ? "notebook-outline" : "folder-outline"}
                            iconColor={item.type === ItemType.NOTEBOOK ? theme.colors.primaryContainer : theme.colors.tertiaryContainer}
                            size={30}
                        />
                        <Text style={styles.itemText}
                            numberOfLines={2}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    <IconButton icon="play" iconColor={theme.colors.onBackground} size={30} />
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
        <FAB
            style={styles.fab}
            icon="plus"
            label="Add"
            onPress={() => openDialog(null)}
        />
    </View>;
}

const ROOT_PATH = '/root/';
const SEP = '/';
const NOTEBOOK_SUFFIX = '_notebooks';

const keyForSubGroups = path => path;
const keyForNotebooks = path => path + NOTEBOOK_SUFFIX;

const getGroupPath = (currentPath, groupName) => keyForSubGroups(currentPath) + groupName + SEP;
const getNotebookPath = (currentPath, notebookName) => keyForNotebooks(currentPath) + SEP + notebookName;

const getPreviousPath = (path) => {
    const _paths = path.split(SEP).filter(Boolean);
    _paths.pop(); // Remove the last group
    return (_paths.length ? (SEP + _paths.join(SEP) + SEP) : ROOT_PATH); // If empty, go back to root
};

const namesOfItemsOfType = (items, type) => items.filter(x => x.type === type).map(x => x.name);
const createItem = (name, type) => ({ 'name': name, 'type': type });

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [currentPath, setCurrentPath] = useState(ROOT_PATH);
    const [items, setItems] = useState([]);

    const myDialog = useRef({ createDialog: null });

    useEffect(() => {
        loadList(currentPath);

        const goBack = () => {
            if (currentPath === ROOT_PATH) return false;  // If at root, can't go back
            setCurrentPath(getPreviousPath(currentPath)); // If empty, go back to root
            return true;
        };

        navigation.setOptions({
            headerLeft: () => (<IconButton
                icon='arrow-left'
                onPress={() => { if (!goBack()) navigation.goBack() }}
                iconColor={theme.colors.onPrimaryContainer}
            />),
            headerRight: () => (<IconButton
                icon="delete-forever"
                onPress={clearStorage}
                iconColor={theme.colors.onPrimaryContainer}
            />)
        });
        const backHandler = BackHandler.addEventListener("hardwareBackPress", goBack);
        return () => backHandler.remove(); // Cleanup on unmount
    }, [navigation, currentPath]);

    const loadList = async (path) => {
        try {
            const storedGroups = await AsyncStorage.getItem(keyForSubGroups(path));
            const storedNotebooks = await AsyncStorage.getItem(keyForNotebooks(path));

            const groups = storedGroups ? JSON.parse(storedGroups) : [];
            const notebooks = storedNotebooks ? JSON.parse(storedNotebooks) : [];

            const items = [];
            for (let i = 0; i < groups.length; i++) {
                items.push(createItem(groups[i], ItemType.GROUP))
            }
            for (let i = 0; i < notebooks.length; i++) {
                items.push(createItem(notebooks[i], ItemType.NOTEBOOK))
            }
            setItems(items);
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    const addItem = async (name, type) => {
        name = name.trim();
        if (name === '') {
            Alert.alert('Error', type + ' name cannot be empty');
            return;
        }
        if (name === NOTEBOOK_SUFFIX) {
            Alert.alert('Error', type + ' name cannot be ' + NOTEBOOK_SUFFIX);
            return;
        }

        try {
            const storageKey = (type === ItemType.NOTEBOOK) ? keyForNotebooks(currentPath) : keyForSubGroups(currentPath);
            const filteredNamesOfItems = namesOfItemsOfType(items, type);

            if (filteredNamesOfItems.includes(name)) {
                Alert.alert('Error', type + ' with same name already exists!');
                return;
            }

            await AsyncStorage.setItem(storageKey, JSON.stringify([...filteredNamesOfItems, name]));
            setItems([...items, createItem(name, type)]);

        } catch (e) {
            console.error('Failed to create ' + type, e);
            Alert.alert('Error', 'Error while creating ' + type);
        }
    };

    const onItemPress = (item) => {
        if (item.type === ItemType.NOTEBOOK) {
            openNotebook(item.name);
        } else {
            openGroup(item.name);
        }
    }

    const openGroup = (groupName) => {
        setCurrentPath(getGroupPath(currentPath, groupName));
    };

    const openNotebook = (notebookName) => {
        navigation.navigate('Notebook', {
            path: getNotebookPath(currentPath, notebookName)
        });
    };

    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            setCurrentPath(ROOT_PATH);
            setItems([]);
            console.log('Storage cleared successfully');
        } catch (e) {
            console.error('Failed to clear storage', e);
        }
    };

    const openDialog = withType => myDialog.current.createDialog(withType);

    return (
        <View style={styles.container}>
            <Text style={styles.breadcrumbs}> {currentPath} </Text>

            {items.length === 0 ? (
                <EmptyContent openDialog={myDialog.current.createDialog} />
            ) : (
                <FilledContent items={items} onItemPress={onItemPress} openDialog={openDialog} />
            )}
            <AddNewDialog ref={myDialog} onDone={addItem} />
        </View>
    );
};

export default HomeScreen;

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,  // Use your primary color hex code or name here
    },
    breadcrumbs: {
        color: theme.colors.secondary, // gray-500
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: theme.colors.onPrimary,
    },
    ec_image: {
        height: 200,
        width: '100%',
    },
    ec_instructionText: {
        color: theme.colors.secondary, // gray-100
        // fontFamily: 'Plight', // Assuming font-plight is mapped to 'Plight'
        fontSize: 12,
        paddingHorizontal: 10,
        textAlign: 'center',
        marginBottom: 16,
    },
    ec_buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: 26,
    },
    ec_buttonWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        marginTop: 16,
    },
    ec_button: {
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary, // gray-100
    },
    ec_icon: {
        height: 48,
        width: 48,
    },
    ec_buttonText: {
        textAlign: 'center',
        color: theme.colors.primary, // gray-100
    },
});

const createEmptyContentStyles = theme => StyleSheet.create({
    image: {
        height: 200,
        width: '100%',
    },
    instructionText: {
        color: theme.colors.secondary, // gray-100
        // fontFamily: 'Plight', // Assuming font-plight is mapped to 'Plight'
        fontSize: 12,
        paddingHorizontal: 10,
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: 26,
    },
    buttonWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        marginTop: 16,
    },
    button: {
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary, // gray-100
    },
    icon: {
        height: 48,
        width: 48,
    },
    buttonText: {
        textAlign: 'center',
        color: theme.colors.primary, // gray-100
    },
});


const createFilledContentStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        marginBottom: 12,
        marginTop: 8,
        marginHorizontal: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 8,
        paddingRight: 16,
        borderWidth: 1,
        borderColor: theme.colors.primary, // gray-100
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginRight: 24,
    },
    itemText: {
        color: theme.colors.onBackground,
        // fontFamily: 'Pmedium', // Assuming 'font-pmedium' maps to 'Pmedium'
        fontSize: 14,
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
}); 
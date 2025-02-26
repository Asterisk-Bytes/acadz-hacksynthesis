import { BackHandler, StyleSheet, Text, View} from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { IconButton, useTheme } from "react-native-paper";
import AddNewDialog from "../components/AddNewDialog";
import ItemType from "../constants/ItemType";
import EmptyContent from '../components/HomeEmptyContent';
import FilledContent from '../components/HomeFilledContent';
import useNotebookData from '../hooks/useNotebookData';
import { 
  ROOT_PATH, 
  getPreviousPath, 
  getGroupPath, 
  getNotebookPath 
} from '../utils/storageUtils';

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [currentPath, setCurrentPath] = useState(ROOT_PATH);
    const { items, loadList, addItem, clearStorage } = useNotebookData();

    const myDialog = useRef({ createDialog: null });

    useEffect(() => {
        loadList(currentPath);

        const goBack = () => {
            if (currentPath === ROOT_PATH) return false;  // If at root, can't go back
            setCurrentPath(getPreviousPath(currentPath)); // If empty, go back to root
            return true;
        };

        navigation.setOptions({
            headerLeft: () => <IconButton
                icon='arrow-left'
                onPress={() => { if (!goBack()) navigation.goBack() }}
                iconColor={theme.colors.onPrimaryContainer}
            />,
            headerRight: () => <IconButton
                icon="delete-forever"
                onPress={() => clearStorage(setCurrentPath)}
                iconColor={theme.colors.onPrimaryContainer}
            />
        });
        const backHandler = BackHandler.addEventListener("hardwareBackPress", goBack);
        return () => backHandler.remove(); // Cleanup on unmount
    }, [currentPath, navigation, clearStorage, theme]);


    const onItemPress = (item) => {
        if (item.type === ItemType.NOTEBOOK)
            navigation.navigate('Notebook', {
                path: getNotebookPath(currentPath, item.name)
            });
        else
            setCurrentPath(getGroupPath(currentPath, item.name));
    }


    const openDialog = withType => myDialog.current.createDialog(withType);

    const handleAddItem = (name, type) => {
        addItem(name, type, currentPath);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.breadcrumbs}> {currentPath} </Text>

            {items.length === 0 ? (
                <EmptyContent openDialog={myDialog.current.createDialog} />
            ) : (
                <FilledContent items={items} onItemPress={onItemPress} openDialog={openDialog} />
            )}
            <AddNewDialog ref={myDialog} onDone={handleAddItem} />
        </View>
    );
};

export default HomeScreen;

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,
    },
    breadcrumbs: {
        color: theme.colors.secondary,
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: theme.colors.onPrimary,
    }
});
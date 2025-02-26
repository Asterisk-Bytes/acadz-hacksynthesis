
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FAB, IconButton, useTheme } from 'react-native-paper';
import ItemType from "../constants/ItemType";

export default function ({ items, onItemPress, openDialog }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                onPress={() => onItemPress(item)}
                activeOpacity={0.7}
                style={styles.touchableContainer}
            >
                <IconButton
                    icon={item.type === ItemType.NOTEBOOK ? 'notebook-outline' : 'folder-outline'}
                    iconColor={
                        item.type === ItemType.NOTEBOOK
                            ? theme.colors.primaryContainer
                            : theme.colors.tertiaryContainer
                    }
                    size={30}
                />
                <Text style={styles.itemText} numberOfLines={2}>
                    {item.name}
                </Text>
            </TouchableOpacity>
            <IconButton icon="play" iconColor={theme.colors.onBackground} size={30} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                // keyExtractor={(item) => item.name} // assuming names are unique
                keyExtractor={(item, index) => index.toString()}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                label="Add"
                onPress={() => openDialog(null)}
            />
        </View>
    );
};

export const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        // marginVertical: 8,
        // marginHorizontal: 20,
        marginBottom: 12,
        marginTop: 8,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 8,
        paddingRight: 16,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginRight: 24,
    },
    itemText: {
        color: theme.colors.onBackground,
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

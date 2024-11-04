import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput, useTheme } from 'react-native-paper';


const createStyles = (theme) => StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        marginBottom: 24
    },
    button: {
        alignItems: 'flex-start',
        paddingHorizontal: 32,
    },
    input: {
        backgroundColor: 'transparent'
    },
    foundText: {
        color: theme.colors.primary,
        padding: 4,
    }
});

export const AddNewDialogType = {
    UNSELECT: 'unselect',
    NOTEBOOK: 'notebook',
    GROUP: 'group'
}

export default function AddNewDialog({ visible, setVisible, type, setType, onDone }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [name, setName] = useState('');

    const hideDialog = () => {
        setName('');
        setVisible(false);
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{'Add New ' + type}</Dialog.Title>
                {type == AddNewDialogType.UNSELECT ? (<View style={styles.buttonsContainer}>
                    <Button
                        style={styles.button}
                        icon="folder-open"
                        onPress={() => setType(AddNewDialogType.GROUP)}>Create Group</Button>
                    <Button
                        style={styles.button}
                        icon="note-text"
                        onPress={() => setType(AddNewDialogType.NOTEBOOK)}>Create Notebook</Button>
                </View>) : (<>
                    <Dialog.Content>
                        <TextInput
                            style={styles.input}
                            mode={'outlined'}
                            label="Enter name"
                            value={name}
                            onChangeText={setName}
                        />
                        {/* {usernameFound &&
                                <Text style={styles.foundText}>User found!</Text>
                            } */}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            onDone(name, type);
                            hideDialog();
                        }}>Ok</Button>
                        <Button onPress={hideDialog}>Cancel</Button>
                    </Dialog.Actions>
                </>)}
            </Dialog>
        </Portal>
    );
}
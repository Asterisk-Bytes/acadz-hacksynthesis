import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput, useTheme } from 'react-native-paper';
import ItemType from '../constants/ItemType';


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

export default AddNewDialog = forwardRef(function ({ onDone }, ref) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState(null);

    useEffect(() => {
        ref.current = {};
        ref.current.createDialog = (withType) => {
            setName('');
            setType(withType);
            setVisible(true);
        }
    }, [ref]);


    const hideDialog = () => {
        setVisible(false);
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{'Add New ' + (type ? type : '')}</Dialog.Title>
                {type === null ? (<View style={styles.buttonsContainer}>
                    <Button
                        style={styles.button}
                        icon="folder-open"
                        onPress={() => setType(ItemType.GROUP)}>Create Group</Button>
                    <Button
                        style={styles.button}
                        icon="note-text"
                        onPress={() => setType(ItemType.NOTEBOOK)}>Create Notebook</Button>
                </View>) : (<>
                    <Dialog.Content>
                        <TextInput
                            style={styles.input}
                            mode={'outlined'}
                            label="Enter name"
                            value={name}
                            onChangeText={setName}
                        />
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
});
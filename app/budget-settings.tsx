import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { getMonthlyBudget, setMonthlyBudget } from './models/budgetModel';

export default function BudgetSettingsScreen() {
    const router = useRouter();
    const db = useSQLiteContext();
    const [budget, setBudget] = useState('');

    useEffect(() => {
        getMonthlyBudget(db).then((val: number) => {
            if (val > 0) setBudget(val.toString());
        });
    }, []);

    const handleSave = async () => {
        if (!budget) return;
        await setMonthlyBudget(db, parseFloat(budget));
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="title" style={styles.title}>Set Monthly Budget</ThemedText>
                <ThemedText style={styles.subtitle}>
                    This limit helps you track your spending.
                </ThemedText>

                <View style={styles.inputContainer}>
                    <ThemedText style={styles.currency}>$</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={budget}
                        onChangeText={setBudget}
                        placeholder="0"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        autoFocus
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <ThemedText style={styles.saveButtonText}>Save Limit</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.6,
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    currency: {
        fontSize: 40,
        fontWeight: 'bold',
        marginRight: 4,
    },
    input: {
        fontSize: 60,
        fontWeight: 'bold',
        color: Colors.light.tint, // Theme this
        minWidth: 100,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

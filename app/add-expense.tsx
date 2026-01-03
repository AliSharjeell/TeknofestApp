import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { addExpense } from './models/expenseModel';

// Categories with icons (using emojis for simplicity or vector icons later)
const CATEGORIES = [
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'entertainment', name: 'Fun', icon: '🎉' },
    { id: 'bills', name: 'Bills', icon: '💡' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'health', name: 'Health', icon: '💊' },
];

export default function AddExpenseScreen() {
    const router = useRouter();
    const db = useSQLiteContext();

    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        if (!amount || !title) return;

        await addExpense(
            db,
            title,
            parseFloat(amount),
            category,
            date.toISOString()
        );
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <ThemedText type="title" style={styles.headerTitle}>Add Expense</ThemedText>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Amount</ThemedText>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Description</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="What is this for?"
                        placeholderTextColor="#888"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Category</ThemedText>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryItem,
                                    category === cat.id && styles.categorySelected
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                <ThemedText style={styles.categoryIcon}>{cat.icon}</ThemedText>
                                <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Date</ThemedText>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <ThemedText>{date.toLocaleDateString()}</ThemedText>
                    </TouchableOpacity>

                    {(showDatePicker || Platform.OS === 'ios') && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event: any, selectedDate?: Date) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    headerTitle: {
        marginBottom: 30,
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        marginBottom: 8,
        opacity: 0.7,
    },
    amountInput: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.light.tint, // You might want to theme this based on context
        paddingVertical: 10,
    },
    input: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        color: '#000', // Need handling for dark mode
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryItem: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categorySelected: {
        borderColor: Colors.light.tint,
        backgroundColor: '#e6f2ff',
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 12,
    },
    dateButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'transparent', // Blur view would be nice here
    },
    saveButton: {
        backgroundColor: Colors.light.tint,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

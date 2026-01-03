import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getMonthlyBudget } from "../models/budgetModel";
import { deleteExpense, getExpenses, type Expense } from "../models/expenseModel";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const expensesData = await getExpenses(db);
      const budgetData = await getMonthlyBudget(db);

      setExpenses(expensesData);
      setBudget(budgetData);

      const total = expensesData.reduce((sum, item) => sum + item.amount, 0);
      setTotalSpent(total);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = async (id: number) => {
    await deleteExpense(db, id);
    loadData();
  };

  const getProgressColor = () => {
    if (budget === 0) return Colors.light.tint;
    const percentage = totalSpent / budget;
    if (percentage > 1) return '#ff3b30'; // Red
    if (percentage > 0.8) return '#ffcc00'; // Yellow
    return '#34c759'; // Green
  };

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={[Colors.light.tint, '#74b9ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.greeting}>Start your</ThemedText>
            <ThemedText type="title" style={styles.mainTitle}>Financial Journey</ThemedText>
          </View>
          <TouchableOpacity onPress={() => router.push('/budget-settings')} style={styles.settingsButton}>
            <IconSymbol name="gearshape.fill" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Budget Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <ThemedText style={styles.cardLabel}>Total Spent</ThemedText>
            <ThemedText style={styles.cardLabel}>Monthly Limit</ThemedText>
          </View>
          <View style={styles.cardRow}>
            <ThemedText type="title" style={styles.spentAmount}>${totalSpent.toFixed(2)}</ThemedText>
            <ThemedText style={styles.budgetAmount}>
              {budget > 0 ? `$${budget.toFixed(2)}` : 'Set Budget'}
            </ThemedText>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min((totalSpent / (budget || 1)) * 100, 100)}%`,
                  backgroundColor: getProgressColor()
                }
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Transactions */}
      <View style={styles.listContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Transactions</ThemedText>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ThemedText>No expenses yet. Add one!</ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.iconContainer}>
                <Text style={{ fontSize: 24 }}>
                  {item.category === 'food' ? '🍔' :
                    item.category === 'transport' ? '🚗' : '💸'}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.date}>{new Date(item.date).toLocaleDateString()}</ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText type="defaultSemiBold">-${item.amount.toFixed(2)}</ThemedText>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <ThemedText style={styles.deleteText}>Delete</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-expense')}
      >
        <IconSymbol name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    color: '#888',
    fontSize: 14,
  },
  spentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  budgetAmount: {
    fontSize: 18,
    color: '#666',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#333',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f5ff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});


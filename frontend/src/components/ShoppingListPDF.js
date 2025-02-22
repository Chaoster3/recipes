import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fdfaf6',
    padding: 40,
    fontFamily: 'Helvetica', // Built-in font
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'Times-Roman', // Built-in serif font
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1px solid #e2e8f0',
  },
  ingredientText: {
    fontSize: 12,
    color: '#334155',
    fontFamily: 'Courier', // Sans-serif font
  },
  amountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Courier', // Monospace font for contrast
  },
});

const ShoppingListPDF = ({ ingredients }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}> Shopping List</Text>
      <View>
        {ingredients.map((ingredient, idx) => (
          <View key={idx} style={styles.ingredientRow}>
            <Text style={styles.ingredientText}>• {ingredient.name}</Text>
            <Text style={styles.amountText}>{ingredient.amount} {ingredient.unit}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ShoppingListPDF;

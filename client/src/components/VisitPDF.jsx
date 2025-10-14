import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Helvetica-Bold',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'Helvetica-Bold',
        borderBottom: '1px solid #ccc',
        paddingBottom: 5,
    },
    text: {
        fontSize: 11,
        marginBottom: 5,
    },
    label: {
        fontFamily: 'Helvetica-Bold',
    },
    historyItem: {
        marginBottom: 8,
        paddingLeft: 10,
        borderLeft: '1px solid #eee',
    },
    noteItem: {
        marginBottom: 8,
        paddingLeft: 10,
        borderLeft: '1px solid #eee',
    },
});

const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
    });
};

// Create Document Component
export function VisitPDF({ visit }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Visit Report</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visit Details</Text>
                    <Text style={styles.text}><Text style={styles.label}>Service Type:</Text> {visit.service_type}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Technician:</Text> {visit.technician}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Location:</Text> {visit.location}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Date:</Text> {visit.date} at {visit.time}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Final Status:</Text> {visit.status}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Status History</Text>
                    {visit.status_history.map((item, index) => (
                        <View key={index} style={styles.historyItem}>
                            <Text style={styles.text}><Text style={styles.label}>Status:</Text> {item.status} at {formatTimestamp(item.timestamp)}</Text>
                            {item.comment && <Text style={styles.text}><Text style={styles.label}>Comment:</Text> {item.comment}</Text>}
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technician Notes</Text>
                    {visit.notes && visit.notes.length > 0 ? (
                        visit.notes.map((item, index) => (
                            <View key={index} style={styles.noteItem}>
                                <Text style={styles.text}><Text style={styles.label}>Note at {formatTimestamp(item.timestamp)}:</Text></Text>
                                <Text style={styles.text}>{item.note}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.text}>No notes were added for this visit.</Text>
                    )}
                </View>
            </Page>
        </Document>
    );
}

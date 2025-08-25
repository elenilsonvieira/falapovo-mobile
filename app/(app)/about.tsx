import { ThemedView } from '@/components/ThemedView';

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';


export default function AboutScreen() {


  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {}
        <Text style={styles.appName}>FalaPovo</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O Nosso Objetivo</Text>
          <Text style={styles.sectionText}>
            O FalaPovo é uma plataforma dedicada a conectar os cidadãos com a gestão da sua cidade. A nossa missão é fornecer uma ferramenta simples e eficaz para que todos possam relatar problemas urbanos, desde buracos na rua a obras por terminar, e acompanhar a sua resolução.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvido por</Text>
          <Text style={styles.sectionText}>
            Este aplicativo foi desenvolvido com dedicação pela equipe da Fluxx Tecnologia, como parte do nosso compromisso com a inovação e o bem-estar social.
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20, 
  },
  version: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

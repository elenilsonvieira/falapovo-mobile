import { useToast } from '@/contexts/ToastContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

const SuportScreen = () => {
    const { showToast } = useToast(); 
    const [feedback, setFeedback] = useState('');
    const [faqExpanded, setFaqExpanded] = useState<null | number>(null);

    const faqQuestions = [
    {
      question: 'Como faço uma denúncia?',
      answer: 'Na tela relatos, toque no ícone "+" e preencha os campos para adicionar detalhes e fotos.'
    },
    {
      question: 'Posso acompanhar minha denúncia?',
      answer: 'Sim! Vá até "Meu Perfil" no menu para acompanhar todas as suas denúncias.'
    },
    {
      question: 'Quais tipos de problemas posso denunciar?',
      answer: 'Você pode relatar buracos, obras, etc.'
    },
  ];

  const sendFeedback = () => {
    if (feedback.trim() === '') {
      showToast("Por favor, escreva seu feedback antes de enviar.", 'error');
      return;
    }

    showToast("Seu feedback foi enviado com sucesso.", 'success');
    setFeedback('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajuda e Suporte</Text>
      <Text style={styles.description}>
        Está com dúvidas sobre como usar o aplicativo? Veja abaixo algumas perguntas frequentes ou envie seu feedback.
      </Text>

      <Text style={styles.sectionTitle}>📘 Perguntas Frequentes</Text>
      {faqQuestions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.faqItem}
          onPress={() => setFaqExpanded(faqExpanded === index ? null : index)}
        >
          <Text style={styles.faqQuestion}>{item.question}</Text>
          {faqExpanded === index && <Text style={styles.faqAnswer}>{item.answer}</Text>}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>⭐ Deixe seu feedback</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escreva aqui o que achou do aplicativo ou sugestões de melhoria..."
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity style={styles.button} onPress={sendFeedback}>
        <Text style={styles.buttonText}>Enviar Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  faqItem: {
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#2e86de',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SuportScreen;

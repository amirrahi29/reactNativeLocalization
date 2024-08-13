import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, I18nManager } from 'react-native';
import i18next from './services/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from './services/languagesList.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

// Function to get available languages from i18next configuration
const getAvailableLanguages = () => {
  return Object.keys(i18next.store.data).filter((lng) => i18next.store.data[lng]);
};

const App = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  useEffect(() => {
    // Load the language from AsyncStorage and apply RTL settings
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          i18next.changeLanguage(savedLanguage);
          I18nManager.forceRTL(savedLanguage === 'ar');
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      }
    };

    loadLanguage();
  }, []);

  useEffect(() => {
    // Update available languages based on i18next configuration
    const languages = getAvailableLanguages();
    setAvailableLanguages(languages);
  }, []);

  const changeLng = async (lng) => {
    try {
      await AsyncStorage.setItem('language', lng);
      i18next.changeLanguage(lng);
      I18nManager.forceRTL(lng === 'ar');
      setVisible(false);
      RNRestart.Restart();
      // Optionally notify the user or handle specific UI updates here
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('welcome')}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.buttonText}>{t('change-language')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={styles.languagesList}>
          <FlatList
            data={availableLanguages}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => changeLng(item)}
              >
                <Text style={styles.lngName}>
                  {languagesList[item]?.nativeName || item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  welcomeText: {
    color: 'black',
  },
  button: {
    backgroundColor: 'blue',
    padding: 8,
    marginStart: 8, // Use marginStart for RTL support
    marginEnd: 8,
    borderRadius: 16,
  },
  buttonText: {
    color: 'white',
  },
  languagesList: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#6258e8',
  },
  languageButton: {
    padding: 10,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  lngName: {
    fontSize: 16,
    color: 'white',
  },
});

export default App;

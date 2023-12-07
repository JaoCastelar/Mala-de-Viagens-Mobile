import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useMalas } from './MalaContext';

export default function Malas() {
    const [malas, setMalas] = useState([]);
    const navigation = useNavigation();
    const [novaMalaNome, setNovaMalaNome] = useState('');
    const [buttonMalaStyle, setButtonMalaStyle] = useState(styles.buttonMala)
    const [buttonStyle, setButtonStyle] = useState(styles.button)

    const { isDarkTheme } = useMalas();
    
    useEffect(() => {
        
        carregarMalas();
        
    }, []);

    useEffect(() => {
        setButtonMalaStyle(StyleSheet.compose(styles.buttonMala, {
            backgroundColor: isDarkTheme ? '#b8871f' : '#783712',
        }));
        setButtonStyle(StyleSheet.compose(styles.button, {
            backgroundColor: isDarkTheme ? '#b8871f' : '#783712',
        }));
    }, [isDarkTheme]);
    
    const limparAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Dados do AsyncStorage limpos com sucesso!');
        } catch (e) {
            console.error('Erro ao limpar o AsyncStorage:', e);
        }
    };
    
    // limparAsyncStorage();
    
    const carregarMalas = async () => {
        try {
            const data = await AsyncStorage.getItem('malas');
            const malasData = data;
            
            if (malasData) {
                setMalas(JSON.parse(malasData));
            }
            
        } catch (error) {
            console.error('Erro ao carregar malas:', error);
        }
    };
    
    const salvarMalas = async (malasToSave) => {
        try {
            await AsyncStorage.setItem('malas', JSON.stringify(malasToSave));
        } catch (error) {
            console.error('Erro ao salvar malas:', error);
        }
    };
    
    const criarMala = () => {
        if (novaMalaNome.trim() !== '' && !malas.includes(novaMalaNome)) {
            Keyboard.dismiss();
            const newMalas = [...malas, novaMalaNome];
            setMalas(newMalas);
            salvarMalas(newMalas);
            setNovaMalaNome('');
        } else {
            alert('Mala com nome inválido ou já existente!')
        }
    }
    
    const abrirMala = (nomeMala) => {
        navigation.navigate('Lembretes', { nomeMala });
    }
    
    return (
        <View style={styles.container}>
        <ScrollView style={styles.scroll}>
        <View style={styles.malas}>
        {malas.map((mala, index) => (
            <View key={index} style={styles.mala}>
            <TouchableOpacity style={buttonStyle} onPress={() => abrirMala(mala)}>
            <Text style={styles.buttonText}>{mala}</Text>
            </TouchableOpacity>
            </View>
            ))}
            </View>
            </ScrollView>
            <View style={styles.criarMala}>
            <TextInput
            style={{backgroundColor: 'lightgrey', color: 'black'}}
            placeholder="Nome da nova mala"
            placeholderTextColor={'black'}
            value={novaMalaNome}
            onChangeText={(text) => setNovaMalaNome(text)}
            />
            <TouchableOpacity style={buttonMalaStyle} onPress={() => criarMala()}>
                <Text style={styles.textButtonMala}>Criar Mala</Text>
            </TouchableOpacity>
            </View>
            </View>
            );
        }        
        
        const styles = StyleSheet.create({
            
            container: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
            },
            
            scroll: {
                width: '100%',
                height: 'auto',
            },
            
            mala: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 150,
                height: 150,
                margin: 10,
            },
            
            button: {
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center',
                // backgroundColor: '#b8871f',
                // backgroundColor: '#783712',
                borderRadius: 15,
                width: '100%',
                height: '100%',
            },

            buttonMala: {
                // backgroundColor: '#b8871f',
                // backgroundColor: '#783712',
                paddingTop: '2.5%',
                paddingBottom: '2.5%',
                
            },

            textButtonMala: {
                textAlign: 'center',
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold',
            },
            
            buttonText: {
                fontSize: 22,
                color: 'white',
                fontWeight: 'bold',
            },
            
            malas: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                padding: 16,
            },
            
            criarMala: {
                display: 'flex',
                width: '100%',
            },
        });
        
        
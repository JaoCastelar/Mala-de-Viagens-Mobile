import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useLembretes } from './LembreteContext';

export default function Lembretes( { route } ) {
    const nomeDaMala = route.params.nomeMala
    // const isDarkTheme = route.params.isDarkTheme
    const { isDarkTheme } = useLembretes();
    const [lembretes, setLembretes] = useState([]);
    const [novoLembreteNome, setNovoLembreteNome] = useState('');
    const [buttonLembreteStyle, setButtonLembreteStyle] = useState(styles.buttonLembrete);
    const [buttonStyle, setButtonStyle] = useState(styles.button);
    
    
    useEffect(() => {
        
        CarregarLembretes(nomeDaMala);
        
    }, []);
    
    useEffect(() => {
        setButtonLembreteStyle(StyleSheet.compose(styles.buttonLembrete, {
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
    
    const CarregarLembretes = async (nomeDaMala) => {
        try {
            const lembretesArmazenados = await AsyncStorage.getItem(`lembretes_${nomeDaMala}`);
            if (lembretesArmazenados) {
                const todosLembretes = JSON.parse(lembretesArmazenados);
                
                setLembretes(todosLembretes);
                
            }
        } catch (error) {
            console.error('Erro ao carregar lembretes do AsyncStorage:', error);
        }
    };
    
    const salvarLembretes = async (lembretesToSave) => {
        try {
            await AsyncStorage.setItem(`lembretes_${nomeDaMala}`, JSON.stringify(lembretesToSave));
        } catch (error) {
            console.error('Erro ao salvar lembretes no AsyncStorage:', error);
        }
    };
    
    
    const criarLembrete = (nomeDaMala) => {
        if (novoLembreteNome.trim() !== '') {
            
            const lembreteExistente = lembretes.find((lembrete) => lembrete.nome === novoLembreteNome);
            
            if (!lembreteExistente) {
                
                const novoLembrete = {
                    nome: novoLembreteNome,
                    ativo: true,
                    mala: nomeDaMala,
                };
                
                const novosLembretes = [...lembretes, novoLembrete];
                
                setLembretes(novosLembretes);
                setNovoLembreteNome('');
                
                salvarLembretes(novosLembretes);
            } else {
                console.log('Lembrete já existe. Escolha um nome diferente.');
            }
        }
    };
    
    const toggleAtivo = (index) => {
        const novosLembretes = [...lembretes];
        novosLembretes[index].ativo = !novosLembretes[index].ativo;
        
        setLembretes(novosLembretes);
        salvarLembretes(novosLembretes);
    };
    
    const riscarLembrete = (index) => {
        const novosLembretes = [...lembretes];
        novosLembretes[index].ativo = !novosLembretes[index].ativo;
        setLembretes(novosLembretes);
        salvarLembretes(novosLembretes);
    };
    
    const removerLembrete = async (index) => {
        const novosLembretes = [...lembretes];
        novosLembretes.splice(index, 1);
        setLembretes(novosLembretes);
        salvarLembretes(novosLembretes);
    };
    
    const compartilharMala = async () => {
        try {
            const lembretesText = lembretes.map((lembrete) => `${lembrete.nome} ${lembrete.ativo ? '[ ]' : '[X]'}`).join('\n');
            
            const filePath = `${FileSystem.documentDirectory}Lista de lembretes - ${nomeDaMala}.txt`;
            await FileSystem.writeAsStringAsync(filePath, lembretesText);
            
            await Sharing.shareAsync(filePath, { mimeType: 'text/plain', dialogTitle: 'Compartilhar Lembretes' });
        } catch (error) {
            console.error('Erro ao compartilhar lembretes:', error);
        }
    };
    
    return (
        <View key={isDarkTheme ? 'true' : 'false'} style={styles.container}>
        <ScrollView style={styles.scroll}>
        <View>
        <TouchableOpacity style={buttonLembreteStyle} onPress={() => compartilharMala()}>
        <Text style={styles.textButtonLembrete}>Compartilhar mala</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.lembretes}>
        {lembretes.map((lembrete, index) => (
            <View key={index} style={styles.lembrete}>
            <TouchableOpacity
            style={[buttonStyle, lembrete.ativo ? null : styles.inativoButton]}
            onPress={() => toggleAtivo(index)}>
            <Text style={[styles.buttonText, lembrete.ativo ? null : styles.textoRiscado]}>
            {lembrete.nome}
            </Text>
            </TouchableOpacity>
            <View style={styles.botoesContainer}>
            <TouchableOpacity onPress={() => riscarLembrete(index)}>
            <Icon name={lembrete.ativo ? 'check-box-outline-blank' : 'check-box'} size={30} color={isDarkTheme ? '#b8871f' : '#783712'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerLembrete(index)}>
            <Icon name="delete" size={30} color={isDarkTheme ? '#b8871f' : '#783712'} />
            </TouchableOpacity>
            </View>
            </View>
            ))}
            
            </View>
            </ScrollView>
            <View style={styles.criarLembrete}>
            <TextInput
            style={{backgroundColor: 'lightgrey', color: 'black'}}
            placeholder="Nome do novo lembrete"
            placeholderTextColor={'black'}
            value={novoLembreteNome}
            onChangeText={(text) => setNovoLembreteNome(text)}
            />
            <TouchableOpacity style={buttonLembreteStyle} onPress={() => criarLembrete(nomeDaMala)}>
            <Text style={styles.textButtonLembrete}>Adicionar Lembrete</Text>
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
            
            lembrete: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 50,
                margin: 10,
            },
            
            button: {
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center',
                // backgroundColor: '#b8871f',
                backgroundColor: '#783712',
                borderRadius: 15,
                width: '80%',
                height: '100%',
            },
            
            botoesContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                // marginTop: 10,
            },
            
            botaoAcao: {
                // color: '#b8871f',
                backgroundColor: '#783712',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
            },
            
            buttonLembrete: {
                // backgroundColor: '#b8871f',
                backgroundColor: '#783712',
                paddingTop: '2.5%',
                paddingBottom: '2.5%',
                
            },
            
            textButtonLembrete: {
                textAlign: 'center',
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold',
            },
            
            textoRiscado: {
                textDecorationLine: 'line-through',
            },
            
            buttonText: {
                fontSize: 22,
                color: 'white',
                fontWeight: 'bold',
            },
            
            lembretes: {
                flexDirection: 'column',
                padding: 4,
            },
            
            criarLembrete: {
                display: 'flex',
                width: '100%',
            },
        });
        
        
import React, {useEffect, useState} from 'react';
import {Modal, Keyboard, Alert, TouchableWithoutFeedback} from 'react-native';
import { Button } from '../../Components/Forms/Button'
import { InputForm } from '../../Components/Forms/InputForm';
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { TransactionTypeButton } from '../../Components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../Components/Forms/CategorySelectButton';
import {CategorySelect} from '../CategorySelect';

import {
   Container,
   Header,
   Title,
   Form,
   Fields,
   TransactionsTypes
} from './styles';
import { useAuth } from '../../hooks/auth';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup
    .number()
    .required('O valor é obrigatório')
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    
});



export function Register(){
    const {user} = useAuth();
    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const [transactionType,setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria'
    });

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    });

    type FormData = {
        [name: string]: any;
      }

    async function handleRegister(form: FormData){
        if (!transactionType) {
            return Alert.alert('Selecione o tipo da transação');
        }

        if (category.key === 'category'){
            return Alert.alert('Selecione uma categoria');
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
           

            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];
            

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'categoria'
            });

            navigation.navigate('Listagem');
            
        } catch(error) {
            console.log(error);
            Alert.alert("Não foi possíval salvar");
        }
    }

    function handleTransactionTypeSelect(type: 'pos' | 'neg') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    
        // async function removeIs() {
        //     await AsyncStorage.removeItem(dataKey);
        // }

        // removeIs();

        // useEffect(() => {
        //     removeIs();
        // });
    


    return (
        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
            
        >
            <Container>

                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            erro={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            erro={errors.amount && errors.amount.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton 
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('pos')}
                                isActive={transactionType ===  'pos'}
                            />
                            <TransactionTypeButton 
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('neg')}
                                isActive={transactionType ===  'neg'}
                            />
                        </TransactionsTypes>

                        <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    <Button 
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
            

    );
    }
import React, { useCallback, useEffect, useState } from 'react';
import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../Components/TransactionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';

import {
   Container,
   Header,
   UserWrapper,
   UserInfo,
   Photo,
   User,
   UserGreeting,
   UserName,
   Icon,
   HighlighCards,
   Transactions,
   Title,
   TransactionList,
   LogoutButton,
   
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard(){
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    function getLastTransactionDate(
      collection : DataListProps[],
      type: 'pos' | 'neg' | 'total'
      ){

        if(type === 'total'){
          const lastTransaction = new Date (
            Math.max.apply(Math,collection
            .map(transaction  => new Date(transaction.date).getTime())));

            return `1 à ${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month : 'long'})}`
        }

      const lastTransaction = new Date (
        Math.max.apply(Math,collection
        .filter(transaction => transaction.type === type)
        .map(transaction  => new Date(transaction.date).getTime())));

      return  `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month : 'long'})}`
    
    }

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.type === 'pos'){
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR',{
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }

    }).reverse();

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'pos');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'neg');
    const lastTransactionTotal = getLastTransactionDate(transactions, 'total');

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionTotal
      }
    });

    setLoading(false);

  }

  useEffect(() => {
    loadTransactions();
  },[]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));
 

  return (
    <Container >
      { 
        loading ? <ActivityIndicator />
        :
      <>
      
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo 
                source={{uri: 'https://cf.shopee.com.br/file/75b35a57f4cbe92a73a0d091f6e38ff0_tn' }}
              />
              <User>
                <UserGreeting>Olá, </UserGreeting>
                <UserName>Parte do login em manutenção...</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={() => {}}>
              <Icon name="power"/>
            </LogoutButton>
          </UserWrapper>

        
        </Header>  

        <HighlighCards>
          <HighlightCard 
            title="Entradas" 
            amount={highlightData.entries.amount} 
            lastTransaction={highlightData.entries.lastTransaction}
            type="up"
          />
          <HighlightCard 
            title="Saidas" 
            amount={highlightData.expensives.amount} 
            lastTransaction={highlightData.expensives.lastTransaction}
            type="down"
          />
          <HighlightCard 
            title="Total" 
            amount={highlightData.total.amount} 
            lastTransaction={highlightData.total.lastTransaction}
            type="total"
          />
          
        </HighlighCards>


        <Transactions>
          <Title>Listagem</Title>

          <TransactionList 
            data={transactions}
            keyExtractor={ item => item.id}
            renderItem={({item}) =>  <TransactionCard data={item} />}
          />

        
        </Transactions>
      </>
      }
    </Container>
  );
}

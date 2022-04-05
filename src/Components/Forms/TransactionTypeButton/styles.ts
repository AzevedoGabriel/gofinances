import styled, {css} from 'styled-components/native';

import {Feather} from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

interface IconProps {
    type: 'up' | 'down';
}

interface ContainerProps {
    isActive: boolean;
    type: 'up' | 'down';

}

export const Container = styled.TouchableOpacity<ContainerProps>`
    width: 48%;

    flex-direction: row;
    align-items: center;
    justify-content: center;

    padding: 16px;
    

    border-width:  ${({ isActive}) => isActive ? 0 : 2}px;
    border-style: dashed;
    border-color: ${({theme}) => theme.colors.text};
    border-radius: 10px;

    

    ${({type, isActive}) => isActive && type === 'down' && css`
        background-color: ${({theme}) => theme.colors.attention_light};
    `};

    ${({type, isActive}) => isActive && type === 'up' && css`
        background-color: ${({theme}) => theme.colors.sucess_light};
    `};

`;


export const Title = styled.Text`
    color: ${({theme}) => theme.colors.text_dark};
    font-size: ${RFValue(14)}px;
    font-family: ${({theme}) => theme.fonts.regular};
`;

export const Icon = styled(Feather)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({theme, type}) => 
    type === 'up' ? theme.colors.sucess : theme.colors.attention};

`;

import React from 'react';
import { TextField,  } from 'react-native-material-textfield';
import Colors from 'App/Assets/Constants';
const TextInput  = React.forwardRef((props, ref) => {
    return (
        <TextField
            autoCapitalize="none"
            placeholderTextColor="#999"
            tintColor={Colors.orange}
            baseColor={props.placeholderTextColor}
            textColor={props.underlineColorAndroid}
            ref={ref}
            onSubmitEditing= {props.onSubmit}
            disabledLineType={'solid'}
            contentInset={{ top: 5 }}
            {...props}
        />
    )
});

export default TextInput;

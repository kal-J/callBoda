import { Picker } from 'native-base';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../layouts/colors';

const Select = (props) => {
  const {
    selectedValue,
    setSelectedValue,
    previous_state,
    newValue,
    items,
  } = props;
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        style={{ width: wp(70) }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedValue({
            ...previous_state,
            [newValue]: itemValue,
          })
        }
      >
        {items.map((item, index) => {
          return (
            <Picker.Item
              key={`${index}`}
              color={colors.primary}
              label={item.name}
              value={item}
            />
          );
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Select;

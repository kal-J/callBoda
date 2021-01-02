import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import colors from '../layouts/colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Stage = (props) => {
  const { name, bodas, topRatedBodas, status } = props.stage;

  return (
    <TouchableOpacity
      style={{ margin: wp(4) }}
      onPress={() =>
        props.navigation.navigate({
          routeName: 'Bodas',
          params: {
            stageName: name,
            bodas: bodas,
          },
        })
      }
    >
      <Card>
        <CardItem style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Text style={{ fontWeight: 'bold', flex: 1 }}>{name}</Text>
          <Text
            style={{
              color: status === 'notVerified' ? colors.primary : 'blue',
              fontSize: 12
            }}
          >
            {status}
          </Text>
        </CardItem>
        <CardItem
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
          }}
        >
          <Text>No. of Bodas: {bodas ? bodas.length : 'Not available'}</Text>

          <TouchableOpacity style={{ flexDirection: 'row' }}>
            <Text>Top rated Boda(s):</Text>
            {topRatedBodas
              ? topRatedBodas.map((boda, index) => {
                  return (
                    <Text
                      key={`${index}`}
                      style={{ color: colors.primary, marginLeft: wp(1) }}
                    >
                      {boda.name}
                    </Text>
                  );
                })
              : null}
          </TouchableOpacity>

          <Text>Stage rating: Not Available</Text>
        </CardItem>
      </Card>
    </TouchableOpacity>
  );
};

export default Stage;

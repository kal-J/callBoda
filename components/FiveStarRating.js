import React from "react";
import { StyleSheet } from "react-native";
import { CardItem, Button, Icon } from "native-base";
import colors from '../layouts/colors';

const FiveStarRating = ({rating}) => {
  let stars = [];
  for(let i = 1; i <= rating; i++ ){
      stars.push(<Icon key={stars.length} style={styles.active_star} name="star"></Icon>);
  }
  for(let j = (5-rating); j > 0; j-- ){
      stars.push(<Icon key={stars.length} style={styles.inactive_star} name="star"></Icon>);
  }
  return (
    <CardItem>
      <Button transparent>
        {stars}
      </Button>
    </CardItem>
  );
};

const styles = StyleSheet.create({
  active_star: {
    color: colors.primary
  },
  inactive_star: {
    color: "grey",
    borderColor: colors.primary
  }
});
export default FiveStarRating;

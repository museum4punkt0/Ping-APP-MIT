import React from 'react';
import { TouchableOpacity, View, Text as Icon } from 'react-native';
import { Actions } from "react-native-router-flux"; 
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Text from "./Text";
import styles, { colors } from '../config/styles';
import strings from "../config/localization";


const getColor = (currIndex, index) => {
  // А нехай йому грець, ви подивіться на цей пиздець
  let color = colors.brownGrey;
  if(currIndex === index) color = colors.white;
  return color;
};


const Navigator = (props) => {  
  const {index, plan} = props;
  const navigator = () => {
    switch (plan) {
      case 1: return <PlanNavigator index={index} />
      case 2: return <DiscoverNavigator index={index} />;
      default: return <DiscoverNavigator index={index} isPlannedTour={plan===4} />;
    }
  };
  return(
    <View style={styles.common.navigationContainer}>
      {navigator()}
    </View>
  );
}
Navigator.propTypes = {
  index: PropTypes.number.isRequired,
  plan: PropTypes.number.isRequired,
};

export default connect(({plan}) => ({ plan:plan.plan }) , { })(Navigator);

export const DiscoverNavigator = (props) => {  
  const {index, isPlannedTour} = props
  return(
    <View style={styles.common.navigationContainer}>
      {!isPlannedTour && (
        <TouchableOpacity onPress={Actions.TinderScene} style={styles.common.navigatorItem}>
          <Icon style={[styles.common.navigatorItemIcon,{color:getColor(1, index)}]}>m</Icon>
          <Icon style={{fontSize:10, color:getColor(1, index)}}>{strings.objects.toUpperCase()}</Icon>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={Actions.ChatsListScene} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(2, index)}]}>b</Icon>
        <Icon style={{fontSize:10, color:getColor(2, index)}}>{strings.chat.toUpperCase()}</Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Actions.DiscoverScreen} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(3, index)}]}>h</Icon>
        <Icon style={{fontSize:10, color:getColor(3, index)}}>{strings.discover.toUpperCase()}</Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Actions.CollectionScene} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(4, index)}]}>g</Icon>
        <Icon style={{fontSize:10, color:getColor(4, index)}}>{strings.collection.toUpperCase()}</Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Actions.ProfileInfoScene} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(5, index)}]}>k</Icon>
        <Icon style={{fontSize:10, color:getColor(5, index)}}>{strings.info.toUpperCase()}</Icon>
      </TouchableOpacity>
    </View>
  );
}
DiscoverNavigator.propTypes = {
  index: PropTypes.number.isRequired,
  isPlannedTour: PropTypes.bool
};
DiscoverNavigator.defaultProps = { isPlannedTour:false }

export const PlanNavigator = (props) => {  
  const {index} = props
  return(
    <View style={styles.common.navigationContainer}>
      <TouchableOpacity onPress={Actions.TinderScene} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(1, index)}]}>m</Icon>
        <Icon style={{fontSize:10, color:getColor(1, index)}}>{strings.objects.toUpperCase()}</Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Actions.PlanScene} style={styles.common.navigatorItem}>
        <MIcon color={getColor(3, index)} size={24} name='star' />
        <Icon style={{fontSize:10, color:getColor(3, index)}}>{strings.myPlan.toUpperCase()}</Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Actions.ChatsListScene} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(2, index)}]}>b</Icon>
        <Icon style={{fontSize:10, color:getColor(2, index)}}>{strings.chat.toUpperCase()}</Icon>
      </TouchableOpacity>
      <TouchableOpacity onPress={Actions.ProfileInfoScene} style={styles.common.navigatorItem}>
        <Icon style={[styles.common.navigatorItemIcon,{color:getColor(5, index)}]}>k</Icon>
        <Icon style={{fontSize:10, color:getColor(5, index)}}>{strings.info.toUpperCase()}</Icon>
      </TouchableOpacity>
    </View>
  );
}
PlanNavigator.propTypes = {
  index: PropTypes.number.isRequired,
};
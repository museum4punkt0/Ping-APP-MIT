import React from 'react';
import { View, TouchableOpacity, Image, ViewPropTypes, Text as Icon, SafeAreaView  } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import Text from "./Text"
import styles, { colors }  from '../config/styles';
import variables from '../config/constants'
import {convertToArray, getImage, getLocalization} from '../config/helpers';
import { setPlanMode } from '../actions/user';

const Header = (props) => {
    const {description, title, backBtnFunc, museums, headerStyle, tour, user, plan, setPlanMode} = props;
    const image = convertToArray(museums.images).find( image => image.image_type === 'logo');
    const logo = image ? getImage(image.image) : 'https://logo';
    // console.warn(Actions.currentScene)
    const tourButton = ()=>(
      <View style={[styles.common.headerButtonContainer, {backgroundColor: plan === 1 ? colors.blue : colors.green, zIndex: 0}]}>
        <Text style={{ color:colors.white, fontSize:10, fontWeight:'bold' }}>{getLocalization(tour.localizations, user.language, 'title').toUpperCase()}</Text>
      </View>
    )

    const onLogoPressed = () => {
      setPlanMode(
        plan === variables.plannedTourMode ? variables.tourMode : plan
      );
      Actions.MuseumsScene()
    }

    return (
      <SafeAreaView style={[headerStyle, {zIndex: 1}]}>
        <View style={[styles.common.headerContainer, headerStyle && {backgroundColor:"rgba(255,255,255,0)"}]}>
          {backBtnFunc ? <BackBtn description={description || ''} title={title} backBtnFunc={backBtnFunc} /> : <Text numberOfLines={3} adjustsFontSizeToFit={true} style={styles.common.headerName}>{title}</Text>}
          <TouchableOpacity onPress={onLogoPressed}>
            <Image source={{uri: logo}} style={{width:110, height:25}} resizeMode="contain" />
          </TouchableOpacity>    
        </View>
        {getLocalization(tour.localizations, user.language, 'title') && tourButton()}
      </SafeAreaView>
    );
  }

Header.propTypes = {
  museums: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  description: PropTypes.string,
  title: PropTypes.string,
  headerStyle: ViewPropTypes.style,
  backBtnFunc: PropTypes.func,
  tour:PropTypes.object,
  plan:PropTypes.number.isRequired
};

Header.defaultProps = {
  backBtnFunc: null,
  headerStyle: null,
  tour:{},
  description:'',
  title:''
};

export default connect(({museums, plan, user}) => ({ museums:museums.museums, tour:plan.tour, plan:plan.plan, user:user.user }) , { setPlanMode })(Header);

const BackBtn = (props) => {
    const {description, title, backBtnFunc} = props;
    return (
      <View style={{flexDirection:'row', alignItems:'center', flex: 0.95}}>      
        <TouchableOpacity onPress={backBtnFunc}>
          <Icon style={styles.common.navigatorItemIcon}>d</Icon>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 15 }}>
          <Text numberOfLines={3} adjustsFontSizeToFit={true} style={[styles.common.headerTitle, { fontSize: description.length === 0 ? 24 : 16 } ]} >{title}</Text>
          {description.length !==0 && <Text numberOfLines={3} adjustsFontSizeToFit={true} style={styles.common.headerDescription} >{description}</Text>}  
        </View>     
      </View>
    );
  }

BackBtn.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  backBtnFunc: PropTypes.func.isRequired
};
import React from 'react';
import { View, TouchableOpacity, Image, ViewPropTypes, Text as Icon  } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import Text from "./Text"
import styles, { colors }  from '../config/styles';
import {convertToArray, getImage, getLocalization} from '../config/helpers';

const Header = (props) => {
    const {description, title, backBtnFunc, museums, headerStyle, tour, user, plan} = props;
    const image = convertToArray(museums.images).find( image => image.image_type === 'logo');
    const logo = image ? getImage(image.image) : 'https://logo';
    // console.warn(Actions.currentScene)
    const tourButton = ()=>(
      <View style={[styles.common.headerButtonContainer, {backgroundColor: plan === 1 ? colors.blue : colors.green, zIndex: 0}]}>
        <Text style={{ color:colors.white, fontSize:10, fontWeight:'bold' }}>{getLocalization(tour.localizations, user.language, 'title').toUpperCase()}</Text>
      </View>
    )
    return (
      <View style={[headerStyle, {zIndex: 1}]}>
        <View style={[styles.common.headerContainer, headerStyle && {backgroundColor:"rgba(255,255,255,0)"}]}>
          {backBtnFunc ? <BackBtn description={description || ''} title={title} backBtnFunc={backBtnFunc} /> : <Text style={styles.common.headerName}>{title}</Text>}
          <TouchableOpacity onPress={()=>Actions.MuseumsScene()}>
            <Image source={{uri: logo}} style={{width:110, height:25}} resizeMode="contain" />
          </TouchableOpacity>    
        </View>
        {getLocalization(tour.localizations, user.language, 'title') && tourButton()}
      </View>
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

export default connect(({museums, plan, user}) => ({ museums:museums.museums, tour:plan.tour, plan:plan.plan, user:user.user }) , { })(Header);

const BackBtn = (props) => {
    const {description, title, backBtnFunc} = props;
    return (
      <View style={{flexDirection:'row', alignItems:'center', flex: 0.95}}>      
        <TouchableOpacity onPress={backBtnFunc}>
          <Icon style={styles.common.navigatorItemIcon}>d</Icon>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 15 }}>
          <Text style={[styles.common.headerTitle, { fontSize: description.length === 0 ? 24 : 16 } ]} >{title}</Text>
          {description.length !==0 && <Text style={styles.common.headerDescription} numberOfLines={1}>{description}</Text>}  
        </View>     
      </View>
    );
  }

BackBtn.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  backBtnFunc: PropTypes.func.isRequired
};
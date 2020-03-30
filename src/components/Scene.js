import React, {Component} from 'react';
import { View, StatusBar, Platform, AppState, ViewPropTypes, YellowBox } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './Header';
import Loader from './Loader'
import Navigator from './BottomNavigation';
import { sync } from '../actions/synchronize';
import styles, { colors } from '../config/styles';

class Scene extends Component {    
  componentDidMount() {
    YellowBox.ignoreWarnings([ 'Warning: componentWill', 'Warning: Failed', 'Possible' ]);
    AppState.addEventListener('change', this._handleAppStateChange);
    if(Platform.OS === 'android') StatusBar.setBackgroundColor(colors.dark, true)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    // eslint-disable-next-line
    const { sync, museums, user, settings } = this.props;
    if (nextAppState === 'background') return sync({ museum:museums, user, settings})
  }


  render(){
    const {children, label, description, backBtnFunc, isHaderShow, isFooterShow, index, loading, headerStyle} = this.props;
    return (
      <View style={styles.common.rootContainer}>
        <StatusBar backgroundColor={colors.dark} barStyle='light-content' />
        {isHaderShow && <Header title={label} description={description} backBtnFunc={backBtnFunc} headerStyle={headerStyle} />}
        <Loader visible={loading} />
        <View style={{flex:1}} {...this.props}>
          {children}
        </View>
        {isFooterShow && <Navigator index={index} />}
      </View>
    );
  }
}


export default connect(({user, museums}) => ({ user:user.user, settings:user.settings, museums:museums.museums}) , {sync})(Scene);


Scene.propTypes = {   
  label: PropTypes.string,
  description: PropTypes.string,
  backBtnFunc: PropTypes.func,
  children: PropTypes.node,
  isHaderShow: PropTypes.bool,
  isFooterShow: PropTypes.bool,
  loading: PropTypes.bool,
  index: PropTypes.number,
  headerStyle: ViewPropTypes.style,
};



Scene.defaultProps = {
  children: null,
  backBtnFunc:null,
  label:'',
  description:'',
  isHaderShow:true,
  isFooterShow:false,
  loading:false,
  index:0,
  headerStyle: {}
};
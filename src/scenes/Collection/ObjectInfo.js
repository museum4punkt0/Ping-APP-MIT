import React, { Component } from 'react';
import { ScrollView, Image, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import Scene from "../../components/Scene";
import Text from "../../components/Text";
import styles, { colors } from '../../config/styles';
import { getLocalization, getImage } from '../../config/helpers';

class ObjectInfoScene extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }
  
  render() {
    const {collection, object, user} = this.props;
    const {localizations} = object || {};
    return (
      <Scene label='' isFooterShow index={4} backBtnFunc={Actions.pop} headerStyle={{backgroundColor:'rgba(255,255,255,0)', position:'absolute', top:0, zIndex:99, width:'100%'}}> 
        <ScrollView style={{flex: 1}}>
          <View style={{flex:1}}>
            <Image style={styles.main.objectInfoContainer} source={{uri: getImage(collection.image)}} />
            <View style={styles.main.objectInfoTitleContainer}>
              <Text style={styles.main.objectInfoTitle}>{getLocalization(localizations, user.language, 'title')}</Text>
              <Text style={styles.main.objectInfoPhrase}>{getLocalization(localizations, user.language, 'phrase')}</Text>
            </View>
          </View>
          
          <View style={{padding:15}}>
            <Text style={styles.main.objectInfoDescription}>{getLocalization(localizations, user.language, 'description')}</Text>
          </View>
        </ScrollView>
      </Scene>
    );
  }
}

ObjectInfoScene.propTypes = {
  user: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired
};

export default connect(({ user }) => ({ user:user.user }) , {})(ObjectInfoScene);
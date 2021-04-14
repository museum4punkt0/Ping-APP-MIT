import React, {Component} from 'react';
import {Modal, View, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import { Svg, Defs, Rect, Mask, Circle, Use } from 'react-native-svg';
import styles from '../../config/styles';
import Button from '../Button';
import Text from '../Text';
import strings from '../../config/localization';

class Onboardeing extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            count:1
        }
    }

    render(){
        const {count} = this.state;
        const {onRequestClose, visible} = this.props;
        const onboarding = () => {
            switch (count) {
                case 1: return <OnboardingSwipe visible={visible} onRequestClose={() => this.setState({count:2})} />;
                case 2: return <OnboardingButtons visible={visible} onRequestClose={onRequestClose} />;
            }
        };

        return (
          <View>
            {onboarding()}
          </View>
        )
    }
}

Onboardeing.propTypes = {
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func
};

Onboardeing.defaultProps = {
  visible: false,
  onRequestClose: () => {}
};

export default Onboardeing;

export const OnboardingSwipe = (props) => {
    const {visible, onRequestClose} = props;
    const width = Dimensions.get('window').width, height = Dimensions.get('window').height
    return (
      <Modal visible={visible} onRequestClose={onRequestClose} transparent>
        <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <Mask id="mask" x="0" y="0" height={height} width={width}>
              <Rect height="100%" width="100%" fill="white" />
              <Circle id="Circle" r={width/2 - 5} cx={width/2} cy={height - width/2 - 155 - 25 - 15} stroke="green" strokeWidth="4" />
            </Mask>
            <Circle id="Circle" r={width/2 - 5} cx={width/2} cy={height - width/2 - 155 - 25 - 15} stroke="green" strokeWidth="4" />
          </Defs>
          <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.9)" mask="url(#mask)" fill-opacity="0" />
          <Use href="#Circle" fill="none" />
        </Svg>
        <View style={[styles.main.dialogContentContainer, {position:'absolute', alignSelf:'center', bottom:25}]}> 
          <Text style={styles.main.dialogContentText}>{strings.swipeRightIf}</Text>
          <Button onPress={onRequestClose} title={strings.gotIt} />            
        </View>
      </Modal>
    )
}

OnboardingSwipe.propTypes = {
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func
};

OnboardingSwipe.defaultProps = {
  visible: false,
  onRequestClose: () => {}
};

export const OnboardingButtons = (props) => {
  const {visible, onRequestClose} = props;
  const width = Dimensions.get('window').width, height = Dimensions.get('window').height
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent>
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <Mask id="mask" x="0" y="0" height={height} width={width}>
            <Rect height="100%" width="100%" fill="white" />
            <Circle id="Circle" r={width/3} cx={width/2} cy={height-width/3 - 30} stroke="green" strokeWidth="4" />
          </Mask>
          <Circle id="Circle" r={width/3} cx={width/2} cy={height - width/3 - 30} stroke="green" strokeWidth="4" />
        </Defs>
        <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.9)" mask="url(#mask)" fill-opacity="0" />
        <Use href="#Circle" fill="none" />
      </Svg>
      <View style={[styles.main.dialogContentContainer, {position:'absolute', alignSelf:'center', bottom: width/3*2 + 45 }]}> 
        <Text style={styles.main.dialogContentText}>{strings.orUseButtons}</Text>
        <Button onPress={onRequestClose} title={strings.gotIt} />            
      </View>
    </Modal>
  )
}

OnboardingButtons.propTypes = {
visible: PropTypes.bool,
onRequestClose: PropTypes.func
};

OnboardingButtons.defaultProps = {
visible: false,
onRequestClose: () => {}
};
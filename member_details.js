import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

export class MemberDetails extends Component {
  render() {
    return (
      <View>
        <Text>This is the member details page for member {this.props.memberId}.</Text>
      </View>
    )
  }
}

MemberDetails.propTypes = {
  memberId: PropTypes.string.isRequired
};

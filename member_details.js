import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

export class MemberDetails extends Component {
  render() {
    m = this.props.member;
    party = m.party=='R' ? 'Republican' :
            m.party=='D' ? 'Democrat' :
            m.party;
    state = m.district===null ? m.state : m.state + '-' + m.district;
    return (
      <View>
        <Text>This is the member details page for member {m.id}.</Text>
        <Text>{m.first_name} {m.last_name}</Text>
        <Text>{party} from {state}</Text>
      </View>
    )
  }
}

MemberDetails.propTypes = {
  member: PropTypes.object.isRequired,
};

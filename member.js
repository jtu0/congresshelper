import React, { Component, PropTypes } from 'react';
import { ListView,
         Text,
         TouchableHighlight,
         View,
       } from 'react-native';
import { ApiKey } from './api_key';
import { Bills } from './bills';
import { committee_canonical_name } from './committee';

export class Member extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      committees: new Set(),
    }
    this._setMemberCommittees();
  }

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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(committee) => this._renderRow(committee)}
        />
        <Bills
          filter={(bill) => this.state.committees.has(committee_canonical_name(bill.committees))}
        />
      </View>
    )
  }

  _renderRow(committee) {
    text=committee.name + ' (through ' + committee.end_date + ')';
    return(
      <Text>{text}</Text>
    )
  }

  async _setMemberCommittees() {
    committees = await this._getMemberFromApiAsync();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(committees),
      committees: new Set(committees.map((c) =>
        committee_canonical_name(c.name))),
    });
  }

  async _getMemberFromApiAsync() {
    try {
      let response = await this._fetchMember();
      let responseJson = await response.json();
      committees = [];
      for (var result of responseJson.results) {
        for (var role of result.roles) {
          // Guard against bad data from Propublica (missing committees in most recent session)
          if (role.committees.length > 0) {
            for (var committee of role.committees) {
              committees.push(committee);
            }
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return committees;
  }

  _fetchMember() {
    m = this.props.member;
    if (m.api_uri.startsWith('https://api.propublica.org/')) {
      return fetch(m.api_uri, {
        method: 'GET',
        headers: {
          'X-API-Key': ApiKey,
        }
      });
    }
    else {
      console.error('Warning: cross domain request with member uri '+m.api_uri);
    }
  }
}

Member.propTypes = {
  member: PropTypes.object.isRequired,
};

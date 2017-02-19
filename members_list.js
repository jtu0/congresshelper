import React, { Component, PropTypes } from 'react';
import { Text,
	       ListView,
         TouchableHighlight,
       } from 'react-native';
import { ApiKey } from './api_key';

var membersHouse = { displayNames: [], lastUpdated: null };
export class MembersList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(membersHouse.displayNames),
    }
    var fifty_minutes = 3000000;
    if (membersHouse.lastUpdated === null || Date.now() - membersHouse.lastUpdate > fifty_minutes) {
      this._setMembersHouse();
    }
  }


  async _setMembersHouse() {
    membersHouse.displayNames = await this._getMembersHouseFromApiAsync();
    membersHouse.lastUpdated = Date.now();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(membersHouse.displayNames),
    });
  }

  async _getMembersHouseFromApiAsync() {
    try {
      let response = await this._fetchMembersHouse();
      let responseJson = await response.json();
      displayNames = [];
      for (var result of responseJson.results) {
        for (var member of result.members) {
          displayNames.push('(' + member.state + '-' + member.district + ' ' + member.party + ') ' +
                            member.first_name + ' ' + member.last_name);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return displayNames.sort();
  }

  _fetchMembersHouse() {
    return fetch('https://api.propublica.org/congress/v1/114/house/members.json', {
      method: 'GET',
      headers: {
        'X-API-Key': ApiKey,
      }
    });
  }

  _renderRow(rowData) {
    return(
      <TouchableHighlight onPress={() => this.props.onSelect('FAKE_MEMBER_ID')}>
        <Text>{rowData}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this._renderRow(rowData)}
      />
    );
  }
}

MembersList.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

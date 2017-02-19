import React, { Component, PropTypes } from 'react';
import { Text,
	       ListView,
         TouchableHighlight,
       } from 'react-native';
import { ApiKey } from './api_key';

export class MembersList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([])
    }
    this._getMembersHouseFromApiAsync();
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
      displayNames.sort()
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(displayNames),
      });
    } catch (error) {
      console.error(error);
    }
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

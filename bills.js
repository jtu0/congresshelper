import React, { Component, PropTypes } from 'react';
import { ListView,
         Text,
         View,
       } from 'react-native';
import { ApiKey } from './api_key';

export class Bills extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
    }
    this._setMemberCommitteeBills();
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(bill) => this._renderRow(bill)}
      />
    )
  }

  _renderRow(bill) {
    return(
      <View>
        <Text>[{bill.number}] {bill.title}</Text>
        <Text>Introduced on {bill.introduced_date}</Text>
        <Text>{bill.latest_major_action} on {bill.latest_major_action_date}</Text>
      </View>
    )
  }

  async _setMemberCommitteeBills() {
    committeeBills = await this._getBillsFromApiAsync();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(committeeBills),
    });
  }

  async _getBillsFromApiAsync() {
    try {
      let responseJsons = await this._fetchBills();
      bills = [];
      for (var responseJson of responseJsons) {
        for (var result of responseJson.results) {
          // Guard against bad data from Propublica (missing committees in most recent session)
          if (result.bills.length > 0) {
            for (var bill of result.bills) {
              if (this.props.filter(bill)) {
                bills.push(bill);
              }
            }
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return bills;
  }

  _fetchBills() {
    responseJsons = ['introduced', 'updated', 'major'].map((billType) =>
      fetch(`https://api.propublica.org/congress/v1/115/house/bills/${billType}.json`, {
        method: 'GET',
        headers: {
          'X-API-Key': ApiKey,
        }
    }).then((response) => response.json()));
    return Promise.all(responseJsons)
  }

  static propTypes = {
    filter: PropTypes.func.isRequired,
  };
}

/*
	Date: 9/7/2018
	Author: Or Nevo Michrowski
	Description: This component is
*/

import React, { Component } from 'react';
import PropTypes from "prop-types";
import { SectionList, Button, View, Text } from "react-native";

import StoreManager from "../StoreManager";


// Converts a string entry to an object
function parseEntry(entry) {
	try {
		const points = entry.amount * entry.unit.points;

		return {
			date: entry.date,
			time: entry.hour,
			msg: points.toString() + " נקודות: " + entry.amount.toString() + " כפול " + entry.unit.unit + " של " + entry.food.name
		}
	} catch (e) {
		return {
			date: "ERROR",
			time: "ERROR",
			msg: "ERROR WITH ENTRY: '" + entry + "'"
		};
	}
}


/* The react component */

class HistoryView extends Component {

	constructor(){
		super();

		let sections = [];
		const history = StoreManager.getLog();

		var i = 0;
		while(i < history.length) {
			let currEntry = parseEntry(history[i]);
			let currSecData = [];
			const date = currEntry.date;

			do {
				currEntry = parseEntry(history[i++]);
				currSecData.push(currEntry);
			} while (i < history.length && currEntry.date === date);

			sections.push({title:date, data:currSecData});
		}

		this.state = {
			sections
		};
	}

	render() {
		return (
			<View style={{ direction: "rtl", padding: 60, backgroundColor: "rgb(244, 255, 255)", flex: 1 }}>
				<Button onPress={this.props.onReturn} title={"בחזרה למסך הראשי"} color="#70c4df"/>

				<SectionList
					style={{marginTop: 10}}
					renderItem={({item, index, section}) => (
						<Text key={index} style={{padding: 10, backgroundColor: (index%2 ? "" : "rgb(229, 246, 246)")}}>
							<Text style={{fontWeight: "bold", textAlign: "right"}}>{item.time}:{"\n"}</Text>
							<Text>{item.msg}</Text>
						</Text>
					)}
					renderSectionHeader={({section: {title}}, i) => (
						<Text style={{padding: 20, backgroundColor: "rgb(227, 227, 227)", fontWeight: 'bold'}}>{title}</Text>
					)}
					sections={this.state.sections}
					keyExtractor={(item, index) => item.time + index}
				/>

			</View>
		)

	}

}


HistoryView.propTypes = {
	onReturn: PropTypes.array.isRequired,
}


export default HistoryView;

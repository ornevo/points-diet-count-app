/*
	Date: 8/7/2018
	Author: Or Nevo Michrowski
	Description: This component is
*/

import React, { Component } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput } from "react-native";
import PropTypes from "prop-types";


/* The react component */

class FoodSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inputVal: ""
		};
	}

	onChangeText(newText) {
		this.setState({inputVal: newText});
	}

	onFoodSelection(newFood) {
		this.props.onReturn(newFood, this.props.itemsList.indexOf(newFood));
	}

	render() {

		const inpStyle = {
			padding: 10,
			direction: "rtl"
		};

		return (
			<View style={{ direction: "rtl", padding: 60, backgroundColor: "rgb(244, 255, 255)", flex: 1 }}>
				<Button onPress={(_ => this.props.onReturn(this.props.itemsList[0], 0)).bind(this)} title={"בטל בחירה"} color="#70c4df" />
				<Text style={{ textAlign: "center", fontSize: 20, margin: 20 }}>בחירה</Text>

				<Text>חיפוש:</Text>
				<TextInput style={inpStyle} onChangeText={this.onChangeText.bind(this)} value={this.state.inputVal} />

				<FlatList data={this.props.itemsList.filter(food => food.name.indexOf(this.state.inputVal.trim()) !== -1)}
					renderItem={({item}) =>
						<TouchableOpacity onPress={(() => this.onFoodSelection(item)).bind(this)} key={item.name}>
							<Text style={{margin: 10, borderTop: "1px solid black"}}>{item.name}</Text>
						</TouchableOpacity>
					}
					keyExtractor={(item, index) => item.name + index}
				/>
			</View>
		);
	}

}

FoodSelect.propTypes = {
	onReturn: PropTypes.array.isRequired,
	itemsList: PropTypes.array.isRequired,
};

FoodSelect.defaultProps = { initValue: "" };


export default FoodSelect;

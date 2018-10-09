import React from "react";
import { StyleSheet, Text, ScrollView, Button, Picker, TextInput } from "react-native";

export default class AddPointsView extends React.Component {
	constructor() {
		super();
		this.state = {
			foodName: "",
			unitName: "",
			points: "0"
		};
	}

	onNameChange(foodName, _) {
		this.setState({foodName});
	}

	onUnitChange(unitName, _) {
		this.setState({unitName});
	}

	onAmountChange(points) {
		this.setState({points});
	}

	onSubmit() {
		this.props.onAddFood(this.props.foodConstructor(this.state.foodName, [this.state.unitName, Number(this.state.points)]));
		this.props.onReturn();
	}

	render() {

		const inpStyle = {
			padding: 10,
			direction: "rtl"
		};

		return (
			<ScrollView style={{direction: "rtl", padding: 60, backgroundColor: "rgb(244, 255, 255)", flex: 1}}>
				<Button onPress={this.props.onReturn} title={"בחזרה למסך הראשי"} color="#70c4df"/>
				<Text style={{textAlign: "center", fontSize: 35, margin: 20}}>הוספת מאכל</Text>
				<Text>שם:</Text>
				<TextInput style={inpStyle} onChangeText={this.onNameChange.bind(this)} value={this.state.foodName}/>

				<Text>יחידת מידה:</Text>
				<TextInput style={inpStyle} onChangeText={this.onUnitChange.bind(this)} value={this.state.unitName}/>

				<Text>עלות בנקודות:</Text>
				<TextInput keyboardType="numeric" style={inpStyle} onChangeText={this.onAmountChange.bind(this)} value={this.state.points}/>

				<Button onPress={this.onSubmit.bind(this)} title="עדכן" />
			</ScrollView>
		);
	}
}

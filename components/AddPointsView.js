import React from "react";
import { StyleSheet, Text, ScrollView, Button, Picker, TextInput } from "react-native";
import FoodSelect from "./FoodSelect";
import StoreManager from "../StoreManager";


export default class AddPointsView extends React.Component {
	constructor(props) {
		super();
		this.state = {
			selectedFood: props.pointsMap[0],
			selectedFoodIndex: 0,
			selectedUnit: props.pointsMap[0].points[0],
			selectedAmount: "",
			foodSelectionOpen: false
		};
	}

	onFoodSelection(selectedFood, selectedFoodIndex) {
		this.setState({
			selectedFood,
			selectedFoodIndex,
			foodSelectionOpen: false,
			selectedUnit: selectedFood.points[0]
		});
	}

	openFoodSelection() {
		this.setState({foodSelectionOpen: true});
	}

	onUnitSelection(selectedUnit, _) {
		this.setState({selectedUnit});
	}

	onAmountChange(newAmountStr) {
		this.setState({selectedAmount: newAmountStr});
	}

	onSubmit() {
		StoreManager.logPoints(this.state.selectedFood, this.state.selectedUnit, Number(this.state.selectedAmount));

		const pointsAmount = Number(this.state.selectedAmount) * this.state.selectedUnit.points;
		this.props.onAddPoints(pointsAmount);
		this.props.onReturn();
	}

	render() {

		const inpStyle = {
			padding: 10,
			direction: "rtl"
		};

		if(this.state.foodSelectionOpen)
			return <FoodSelect onReturn={this.onFoodSelection.bind(this)}
				itemsList={this.props.pointsMap} />;

		const unitSelection = this.state.selectedFood ?
			<ScrollView>
				<Text>יחידת מידה:</Text>
				<Picker
					selectedValue={this.state.selectedUnit}
					onValueChange={this.onUnitSelection.bind(this)}>
					{this.props.pointsMap[this.state.selectedFoodIndex].points.map(unit =>
						<Picker.Item label={unit.unit} value={unit} key={unit.unit}/>
					)}
				</Picker>
			</ScrollView> : <ScrollView></ScrollView>;

		const submitSection = Number(this.state.selectedAmount) > 0 ?
			<ScrollView>
				<Text>נקודות: {this.state.selectedUnit.points*this.state.selectedAmount}</Text>
				<Button onPress={this.onSubmit.bind(this)} title="עדכן" />
			</ScrollView> : <ScrollView></ScrollView>;

		return (
			<ScrollView style={{direction: "rtl", padding: 60, backgroundColor: "rgb(244, 255, 255)", flex: 1}}>
				<Button onPress={this.props.onReturn} title={"בחזרה למסך הראשי"} color="#70c4df"/>
				<Text style={{textAlign: "center", fontSize: 35, margin: 20}}>עדכון נקודות</Text>
				<Text>המאכל:</Text>
				<Button onPress={this.openFoodSelection.bind(this)}
					title={this.state.selectedFood.name} color="#70c4df"/>

				{unitSelection}

				<Text>כמות:</Text>
				<TextInput keyboardType="numeric" style={inpStyle} onChangeText={this.onAmountChange.bind(this)} value={this.state.selectedAmount}/>

				{submitSection}
			</ScrollView>
		);
	}
}

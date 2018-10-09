import React from "react";
import FoodSelect from "./FoodSelect";
import { StyleSheet, Text, ScrollView, Button, Picker, TextInput } from "react-native";


function clone(obj) { return JSON.parse(JSON.stringify(obj)); }


export default class AddPointsView extends React.Component {
	constructor(props) {
		super();
		this.state = {
			selectedFood: props.pointsMap[0],
			selectedFoodIndex: 0,
			selectedFoodPoints: props.pointsMap[0].points,
			selectedUnitIndex: 0,
			foodSelectionOpen: false
		};
	}

	onFoodSelection(selectedFood, selectedFoodIndex) {
		this.setState({
			selectedFood: clone(selectedFood),
			selectedFoodIndex: clone(selectedFoodIndex),
			selectedFoodPoints: clone(selectedFood.points),
			selectedUnitIndex: 0,
			foodSelectionOpen: false
		});
	}

	onUnitSelection(_, selectedUnitIndex) {
		this.setState({selectedUnitIndex});
	}

	onSubmit() {
		const updatedFood = Object.assign({}, this.state.selectedFood, {points: this.state.selectedFoodPoints});

		this.props.onEditFood(this.state.selectedFoodIndex, updatedFood);
		this.props.onReturn();
	}

	onNameChange(newName) {
		const newFood = Object.assign({}, this.state.selectedFood, {name: newName});
		this.setState({selectedFood: newFood});
	}

	updatePoints(newUnit) {
		let newPoints = clone(this.state.selectedFoodPoints);
		newPoints[this.state.selectedUnitIndex] = newUnit;

		this.setState({selectedFoodPoints: newPoints});
	}

	onUnitValueChange(newUnitValue) {
		this.updatePoints({
			points: newUnitValue,
			unit: this.state.selectedFoodPoints[this.state.selectedUnitIndex].unit
		});
	}

	onUnitNameChange(newUnitName) {
		this.updatePoints({
			points: this.state.selectedFoodPoints[this.state.selectedUnitIndex].points,
			unit: newUnitName
		});
	}

	addUnit() {
		const newUnit = {
			unit: "שם יחידת המידה",
			points: 0
		};

		let newFoodPointsArr = clone(this.state.selectedFoodPoints);
		newFoodPointsArr.push(newUnit);

		this.setState({
			selectedFoodPoints: newFoodPointsArr,
			selectedUnitIndex: newFoodPointsArr.length - 1
		});
	}

	openFoodSelection() {
		this.setState({foodSelectionOpen: true});
	}

	render() {
		const inpStyle = {
			padding: 10,
			direction: "rtl"
		};

		const currFood = this.props.pointsMap[this.state.selectedFoodIndex];
		const currUnit = currFood.points[this.state.selectedUnitIndex];

		if(this.state.foodSelectionOpen)
			return <FoodSelect onReturn={this.onFoodSelection.bind(this)}
				itemsList={this.props.pointsMap} />;

		return (
			<ScrollView style={{direction: "rtl", padding: 60, backgroundColor: "rgb(244, 255, 255)", flex: 1}}>
				<Button onPress={this.props.onReturn} title={"בחזרה למסך הראשי"} color="#70c4df"/>
				<Text style={{textAlign: "center", fontSize: 20, margin: 20}}>עריכת מאכל</Text>

				<Text>בחירת מאכל</Text>
				<Button onPress={this.openFoodSelection.bind(this)}
					title={this.state.selectedFood.name} color="#70c4df"/>

				<Text>בחירת יחידת מידה</Text>
				<Picker
					selectedValue={currUnit}
					onValueChange={this.onUnitSelection.bind(this)}>
					{currFood.points.map(unit =>
						<Picker.Item label={unit.unit} value={unit} key={unit.unit}/>
					)}
				</Picker>

				<Button onPress={this.addUnit.bind(this)} color="#6ab04c" title="הוסף יחידת מידה" />

				<Text style={{marginTop: 10}}>ערוך שם המאכל:</Text>
				<TextInput style={inpStyle} onChangeText={this.onNameChange.bind(this)} value={this.state.selectedFood.name}/>

				<Text>ערוך שם יחידת המידה:</Text>
				<TextInput style={inpStyle} onChangeText={this.onUnitNameChange.bind(this)}
					value={this.state.selectedFoodPoints[this.state.selectedUnitIndex].unit}/>

				<Text>ערוך ניקוד:</Text>
				<TextInput style={inpStyle} keyboardType="numeric" onChangeText={this.onUnitValueChange.bind(this)}
					value={this.state.selectedFoodPoints[this.state.selectedUnitIndex].points.toString()}/>

				<Button onPress={this.onSubmit.bind(this)} title="עדכן" />

			</ScrollView>
		);
	}
}

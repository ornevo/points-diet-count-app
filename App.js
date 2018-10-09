import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import StoreManager from "./StoreManager";

import AddPointsView from "./components/AddPointsView.js";
import AddFoodView from "./components/AddFoodView.js";
import EditFoodView from "./components/EditFoodView.js";
import HistoryView from "./components/HistoryView.js";


function Product(prodName, ...pointsList) {
    // Each item in points list should be an array of ["Unit of measure", "points per unit"]
    let ret = {};

    ret.name = prodName;

    ret.points = [];
    for (i=0; i<pointsList.length; i++) {
        const unitOfMeasure = pointsList[i];
        ret.points.push({
            unit: unitOfMeasure[0],
            points: unitOfMeasure[1]
        })
    }

    return ret;
}


const MAIN_VIEW = "main";
const ADD_POINT_VIEW = "addpoints";
const EDIT_FOOD_VIEW = "editfood";
const ADD_FOOD_VIEW = "addfood";
const HISTORY_VIEW = "history";


export default class App extends React.Component {

    constructor() {
        super()

        this.state = {
            points: 0,
            view: MAIN_VIEW,
            pointsMap: [{name: "טוען...", points: [{unit: 'טוען...', points: -1}]}]
        }
    }

    componentDidMount() {
        // Initialize the points map
        StoreManager.initStoreManager((() => {
            this.setState({
                pointsMap: StoreManager.getPointsMap(),
                points: StoreManager.getPoints()
            })
        }).bind(this));
    }

    onAddPointsPress() { this.setState({view: ADD_POINT_VIEW}) }
    onEditFoodPress() { this.setState({view: EDIT_FOOD_VIEW}) }
    onAddFoodPress() { this.setState({view: ADD_FOOD_VIEW}) }
    onHistoryPress() { this.setState({view: HISTORY_VIEW}) }

    /* Other screens' updates  */
    addPoints(points) {
        this.setState({points: this.state.points - points});
        StoreManager.removePoints(points);
    }

    editFood(foodIndex, newValue) {
        StoreManager.updateFood(newValue, foodIndex);

        let newFood = [];
        for(var i = 0; i < this.state.pointsMap.length; ++i) {
            if(i == foodIndex) newFood.push(newValue);
            else newFood.push(this.state.pointsMap[i]);
        }

        this.setState({pointsMap: newFood});
    }

    addFood(newFood) {
            StoreManager.addFood(newFood);

        this.setState({pointsMap: [...this.state.pointsMap, newFood]});
    }

    render() {
        const bigTextStyle = {
            color: "rgb(50, 50, 50)",
            textAlign: "center",
            fontSize: 30,
            marginBottom: 9
        };

        let rend = "";

        switch (this.state.view) {
            case MAIN_VIEW:
                rend = (
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.label}>נקודות</Text>
                            <Text style={Object.assign({}, bigTextStyle, {color: this.state.points < 0 ? 'red' : 'black'})}>
															{this.state.points.toString().substring(0, 6)}
														</Text>
                        </View>

                        <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                            <Button  onPress={this.onAddPointsPress.bind(this)} title="עדכן נקודות" color="#70c4df" style={{marginVertical: 10}}></Button>
                            <Button  onPress={this.onEditFoodPress.bind(this)} title="ערוך מאכלים" color="#70c4df" style={{marginVertical: 10}} ></Button>
                            <Button  onPress={this.onAddFoodPress.bind(this)} title="הוסף מאכל" color="#70c4df" style={{marginVertical: 10}} ></Button>
                            <Button  onPress={this.onHistoryPress.bind(this)} title="היסטוריה" color="#70c4df" style={{marginVertical: 10}} ></Button>
                        </View>
                    </View>
                );
                break;

            case ADD_POINT_VIEW:
                rend = <AddPointsView   pointsMap={this.state.pointsMap}
                                        onAddPoints={this.addPoints.bind(this)}
                                        onReturn={() => this.setState({view: MAIN_VIEW})} />;
                break;

            case EDIT_FOOD_VIEW:
                rend = <EditFoodView    pointsMap={this.state.pointsMap}
                                        onEditFood={this.editFood.bind(this)}
                                        onReturn={() => this.setState({view: MAIN_VIEW})} />;
                break;

            case ADD_FOOD_VIEW:
                rend = <AddFoodView     onAddFood={this.addFood.bind(this)}
                                        foodConstructor={Product}
                                        onReturn={() => this.setState({view: MAIN_VIEW})} />;
                break;
            case HISTORY_VIEW:
                rend = <HistoryView onReturn={() => this.setState({view: MAIN_VIEW})} />;
                break;

            default:
                rend = <Text style={{color: 'red', padding:40}}>Router Error.</Text>;
                break;
        }
        return rend;
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(244, 255, 255)',
    padding: 60,
    justifyContent: 'space-between',
  },
  label: {
      color: "rgba(180, 180, 180, 0.8)",
      textAlign: "center",
      fontSize: 35
  },
});

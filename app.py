from flask import Flask, jsonify, request
from flask import CORS

from gametest import (
    get_airports,
    start_airport,
    get_goals,
    create_game,
    get_airport_info,
    check_goal,
    calculate_distance,
    airports_in_range,
    update_location,
)

app = Flask(__name__)
CORS(app)

@app.route('/get_airports', methods=['GET'])
def get_airports_route():
    airports = get_airports()
    return jsonify(airports)

@app.route('/start_airport', methods=['GET'])
def start_airport_route():
    start_airport_data = start_airport()
    return jsonify(start_airport_data)

@app.route('/get_goals', methods=['GET'])
def get_goals_route():
    goals = get_goals()
    return jsonify(goals)

@app.route('/create_game', methods=['POST'])
def create_game_route():
    data = request.get_json()
    start_money = data.get('start_money')
    p_range = data.get('p_range')
    cur_airport = data.get('cur_airport')
    p_name = data.get('p_name')
    a_ports = data.get('a_ports')

    game_id = create_game(start_money, p_range, cur_airport, p_name, a_ports)
    return jsonify({'game_id': game_id})

@app.route('/get_airport_info/<icao>', methods=['GET'])
def get_airport_info_route(icao):
    airport_info = get_airport_info(icao)
    return jsonify(airport_info)

@app.route('/check_goal/<int:g_id>/<icao>', methods=['GET'])
def check_goal_route(g_id, icao):
    goal_info = check_goal(g_id, icao)
    return jsonify(goal_info)

@app.route('/calculate_distance/<current>/<target>', methods=['GET'])
def calculate_distance_route(current, target):
    dist = calculate_distance(current, target)
    return jsonify({'distance': dist})

@app.route('/airports_in_range/<icao>/<p_range>', methods=['GET'])
def airports_in_range_route(icao, p_range):
    a_ports = get_airports()
    in_range = airports_in_range(icao, a_ports, float(p_range))
    return jsonify(in_range)

@app.route('/update_location', methods=['POST'])
def update_location_route():
    data = request.get_json()
    icao = data.get('icao')
    p_range = data.get('p_range')
    u_money = data.get('u_money')
    g_id = data.get('g_id')

    update_location(icao, p_range, u_money, g_id)
    return jsonify({'message': 'Location updated successfully'})

if __name__ == "__main__":
    app.run(debug=True)

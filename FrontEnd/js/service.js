import api from "./api.js";

class Service {
    async getAirports() {
        try {
            return await api.get("/get_airports");
        } catch (error) {
            console.error("Error receiving Airports");
            throw error;
        }
    }

    async buyFuel(fuelAmount) {
        try {
            return await api.post("/buy_fuel", { fuelAmount });
        } catch (e) {
            console.error("Error buying fuel");
            throw e;
        }
    }

    async resetGame() {
        try {
            return await api.post("/restart_game");
        } catch (e) {
            console.error("Error restarting game");
            throw e;
        }
    }

    async getStory() {
        return await api.get("/story");
    }

    async startAirport() {
        return await api.get("/start_airport");
    }

    async createGame(body) {
        return await api.post("/create_game", body)
    }

    async getAirportInfo(airport) {
        return await api.get(`/get_airport_info/${airport}`);
    }

    async checkGoal({ gameId, currentAirport }) {
        return await api.get(`/check_goal/${gameId}/${currentAirport}`)
    }

    async airportInRange({ icao, airports, playerRange }) {
        return await api.post(`/airports_in_range/${icao}/${playerRange}`, { airports });
    }

    async calculateDistance(fromAirport, targetAirport) {
        return await api.get(`/calculate_distance/${fromAirport}/${targetAirport}`)
    }

    async updateLocation(body) {
        return await api.post('/update_location', body);
    }
}

const service = new Service();
export default service;


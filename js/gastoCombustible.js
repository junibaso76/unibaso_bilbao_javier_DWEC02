// GastoCombustible
class GastoCombustible {
    constructor(vehicleType, date, kilometers) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = 0; // Se calculará y asignará después
    }

    // Convierte el objeto a JSON
    convertToJSON() {
        return JSON.stringify({
            vehicleType: this.vehicleType,
            date: this.date,
            kilometers: this.kilometers,
            precioViaje:parseFloat(this.precioViaje.toFixed(2))
        });
    }
}

export { GastoCombustible };
import type { RealWorldEquivalent } from '../types/ai-levels';

/**
 * Utility functions for calculating real-world environmental equivalencies
 */

export const RealWorldCalculator = {
    /**
     * Calculate real-world equivalent for energy saved
     * @param energyPoints - Game energy points
     * @returns Real-world equivalency object
     */
    energyEquivalent(energyPoints: number): RealWorldEquivalent {
        // 1000 energy points = 1 kWh
        const kwh = energyPoints / 1000;

        // Calculate equivalents
        const smartphones = Math.floor(kwh * 200); // 1 kWh charges ~200 smartphones
        const laptops = Math.floor(kwh * 10); // 1 kWh charges ~10 laptops
        const hours = Math.floor(kwh * 100); // 1 kWh = 100 LED bulb hours

        let equivalent = '';
        if (smartphones > 100) {
            equivalent = `Charging ${smartphones} smartphones`;
        } else if (laptops > 5) {
            equivalent = `Charging ${laptops} laptops`;
        } else if (hours > 10) {
            equivalent = `Powering an LED bulb for ${hours} hours`;
        } else {
            equivalent = `Powering a small device`;
        }

        return {
            metric: 'Energy Saved',
            value: kwh,
            unit: 'kWh',
            equivalent,
            icon: '⚡'
        };
    },

    /**
     * Calculate real-world equivalent for CO2 reduced
     * @param co2Points - Game CO2 points
     * @returns Real-world equivalency object
     */
    co2Equivalent(co2Points: number): RealWorldEquivalent {
        // 100 CO2 points = 1 kg CO2
        const kg = co2Points / 100;

        // Calculate equivalents
        const trees = Math.floor(kg / 21); // 1 tree absorbs ~21kg CO2/year
        const carMiles = Math.floor(kg / 0.404); // 1 mile driven = ~0.404kg CO2
        const flights = Math.floor(kg / 250); // 1 short flight = ~250kg CO2

        let equivalent = '';
        if (flights > 0) {
            equivalent = `Equivalent to ${flights} short flight${flights > 1 ? 's' : ''} avoided`;
        } else if (carMiles > 50) {
            equivalent = `Driving ${carMiles} miles saved`;
        } else if (trees > 0) {
            equivalent = `${trees} tree${trees > 1 ? 's' : ''} planted`;
        } else {
            equivalent = `A small environmental win`;
        }

        return {
            metric: 'CO2 Reduced',
            value: kg,
            unit: 'kg',
            equivalent,
            icon: '🌍'
        };
    },

    /**
     * Calculate real-world equivalent for water saved
     * @param waterPoints - Game water points
     * @returns Real-world equivalency object
     */
    waterEquivalent(waterPoints: number): RealWorldEquivalent {
        // 10 water points = 1 liter
        const liters = waterPoints / 10;

        // Calculate equivalents
        const bottles = Math.floor(liters / 0.5); // 0.5L per bottle
        const showerMinutes = Math.floor(liters / 9.5); // 9.5L per minute shower
        const bathtubs = Math.floor(liters / 150); // 150L per bathtub

        let equivalent = '';
        if (bathtubs > 0) {
            equivalent = `${bathtubs} bathtub${bathtubs > 1 ? 's' : ''} of water`;
        } else if (showerMinutes > 5) {
            equivalent = `${showerMinutes} minutes of showering`;
        } else if (bottles > 10) {
            equivalent = `${bottles} water bottles`;
        } else {
            equivalent = `A few glasses of water`;
        }

        return {
            metric: 'Water Saved',
            value: liters,
            unit: 'L',
            equivalent,
            icon: '💧'
        };
    },

    /**
     * Calculate real-world equivalent for trees planted
     * @param treePoints - Game tree points
     * @returns Real-world equivalency object
     */
    treesEquivalent(treePoints: number): RealWorldEquivalent {
        const trees = Math.floor(treePoints / 10); // 10 points = 1 tree


        // Calculate additional impact
        const co2Absorbed = Math.floor(trees * 21); // 1 tree = 21kg CO2/year

        let equivalent = '';
        if (trees > 100) {
            equivalent = `A small forest (${trees} trees)`;
        } else if (trees > 10) {
            equivalent = `${trees} trees absorbing ${co2Absorbed}kg CO2 yearly`;
        } else if (trees > 0) {
            equivalent = `${trees} tree${trees > 1 ? 's' : ''} planted`;
        } else {
            equivalent = `Contributing to reforestation`;
        }

        return {
            metric: 'Trees Planted',
            value: trees,
            unit: 'trees',
            equivalent,
            icon: '🌳'
        };
    },

    /**
     * Get all equivalents for current player stats
     */
    getAllEquivalents(stats: {
        energySaved: number;
        co2Reduced: number;
        waterSaved: number;
        treesPlanted: number;
    }): RealWorldEquivalent[] {
        return [
            this.energyEquivalent(stats.energySaved),
            this.co2Equivalent(stats.co2Reduced),
            this.waterEquivalent(stats.waterSaved),
            this.treesEquivalent(stats.treesPlanted)
        ];
    }
};

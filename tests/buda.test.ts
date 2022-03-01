import budaTask from '../src/buda';
import { expect } from 'chai';
import 'mocha';

describe('Travel Tests', () => { 
    it('regular horizontal travel', () => {
        const file = '../files/network.csv';
        const start = "A";
        const end = "F";

        const optimalResult = ['A', 'B', 'C', 'D', 'E', 'F'];

        const result = budaTask(file, start, end);
        expect(optimalResult).to.eql(result);
    });
    it('green horizontal travel', () => {
        const file = '../files/network.csv';
        const start = "A";
        const end = "F";
        const color = "verde";

        const optimalResult = ['A', 'B', 'C', 'D', 'E', 'F'];

        const result = budaTask(file, start, end, color);
        expect(optimalResult).to.eql(result);
    });
    it('red horizontal travel', () => {
        const file = '../files/network.csv';
        const start = "A";
        const end = "F";
        const color = "rojo";

        const optimalResult = ['A', 'B', 'C', 'H', 'F'];

        const result = budaTask(file, start, end, color);
        expect(optimalResult).to.eql(result);
    });
    it('regular vertical travel', () => {
        const file = '../files/network.csv';
        const start = "H";
        const end = "E";

        const optimalResult = ['H', 'I', 'F', 'E'];

        const result = budaTask(file, start, end);
        expect(optimalResult).to.eql(result);
    });
    it('red vertical travel', () => {
        const file = '../files/network.csv';
        const start = "H";
        const end = "E";
        const color = "rojo";

        const optimalResult = ['H', 'F', 'E'];

        const result = budaTask(file, start, end, color);
        expect(optimalResult).to.eql(result);
    });
    it('green vertical travel', () => {
        const file = '../files/network.csv';
        const start = "G";
        const end = "E";
        const color = "verde";

        const optimalResult = ['G', 'I', 'F', 'E'];

        const result = budaTask(file, start, end, color);
        expect(optimalResult).to.eql(result);
    });
});
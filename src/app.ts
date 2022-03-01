import budaTask from "./buda";
import inquirer from "inquirer";

const preguntas = [
    {
        type: 'input',
        name: 'file',
        message: 'ingrese ruta del archivo que representa la red: ',
        default: '../files/network.csv'
    },
    {
        type: 'input',
        name: 'start',
        message: 'ingrese la estacion inicial: '
    },
    {
        type: 'input',
        name: 'end',
        message: 'ingrese la estacion final: '
    },
    {
        type: 'input',
        name: 'color',
        message: 'ingrese el color de la ruta: ',
        default: undefined
    }
];

const questionary = async () => {
    const aswers = await inquirer.prompt(preguntas);
    console.log(budaTask(aswers.file, aswers.start, aswers.end, aswers.color));
};

questionary();


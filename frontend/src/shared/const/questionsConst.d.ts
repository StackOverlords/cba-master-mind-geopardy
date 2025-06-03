import type { Question } from "../types";


export const questions: {
    science: Question[]
    history: Question[]
    geography: Question[]
    sports: Question[]
    art: Question[]
} = {
    science: [
        {
            id: "sci1",
            text: "What is the chemical symbol for water?",
            answers: [
                { _id: "a1", text: "H2O", isCorrect: true },
                { _id: "a2", text: "O2", isCorrect: false },
                { _id: "a3", text: "CO2", isCorrect: false },
                { _id: "a4", text: "NaCl", isCorrect: false },
            ],
        },
        {
            id: "sci2",
            text: "What planet is known as the Red Planet?",
            answers: [
                { _id: "a1", text: "Mars", isCorrect: true },
                { _id: "a2", text: "Jupiter", isCorrect: false },
                { _id: "a3", text: "Saturn", isCorrect: false },
                { _id: "a4", text: "Venus", isCorrect: false },
            ],
        },
        {
            id: "sci3",
            text: "Which gas do plants absorb from the atmosphere?",
            answers: [
                { _id: "a1", text: "Oxygen", isCorrect: false },
                { _id: "a2", text: "Carbon dioxide", isCorrect: true },
                { _id: "a3", text: "Hydrogen", isCorrect: false },
                { _id: "a4", text: "Nitrogen", isCorrect: false },
            ],
        },
        {
            id: "sci4",
            text: "What part of the cell contains the genetic material?",
            answers: [
                { _id: "a1", text: "Cytoplasm", isCorrect: false },
                { _id: "a2", text: "Nucleus", isCorrect: true },
                { _id: "a3", text: "Cell wall", isCorrect: false },
                { _id: "a4", text: "Ribosome", isCorrect: false },
            ],
        },
        {
            id: "sci5",
            text: "What force keeps planets in orbit around the sun?",
            answers: [
                { _id: "a1", text: "Magnetism", isCorrect: false },
                { _id: "a2", text: "Inertia", isCorrect: false },
                { _id: "a3", text: "Gravity", isCorrect: true },
                { _id: "a4", text: "Friction", isCorrect: false },
            ],
        },
    ],
    history: [
        {
            id: "his1",
            text: "Who was the first President of the United States?",
            answers: [
                { _id: "a1", text: "Thomas Jefferson", isCorrect: false },
                { _id: "a2", text: "George Washington", isCorrect: true },
                { _id: "a3", text: "Abraham Lincoln", isCorrect: false },
                { _id: "a4", text: "John Adams", isCorrect: false },
            ],
        },
        {
            id: "his2",
            text: "In which year did World War II end?",
            answers: [
                { _id: "a1", text: "1940", isCorrect: false },
                { _id: "a2", text: "1945", isCorrect: true },
                { _id: "a3", text: "1939", isCorrect: false },
                { _id: "a4", text: "1950", isCorrect: false },
            ],
        },
        {
            id: "his3",
            text: "Which empire built the Colosseum?",
            answers: [
                { _id: "a1", text: "Greek", isCorrect: false },
                { _id: "a2", text: "Roman", isCorrect: true },
                { _id: "a3", text: "Ottoman", isCorrect: false },
                { _id: "a4", text: "Byzantine", isCorrect: false },
            ],
        },
        {
            id: "his4",
            text: "Who discovered America in 1492?",
            answers: [
                { _id: "a1", text: "Vasco da Gama", isCorrect: false },
                { _id: "a2", text: "Christopher Columbus", isCorrect: true },
                { _id: "a3", text: "Ferdinand Magellan", isCorrect: false },
                { _id: "a4", text: "Hernán Cortés", isCorrect: false },
            ],
        },
        {
            id: "his5",
            text: "Where did the Industrial Revolution begin?",
            answers: [
                { _id: "a1", text: "Germany", isCorrect: false },
                { _id: "a2", text: "France", isCorrect: false },
                { _id: "a3", text: "United Kingdom", isCorrect: true },
                { _id: "a4", text: "United States", isCorrect: false },
            ],
        },
    ],
    geography: [
        {
            id: "geo1",
            text: "What is the largest continent?",
            answers: [
                { _id: "a1", text: "Africa", isCorrect: false },
                { _id: "a2", text: "Asia", isCorrect: true },
                { _id: "a3", text: "Europe", isCorrect: false },
                { _id: "a4", text: "North America", isCorrect: false },
            ],
        },
        {
            id: "geo2",
            text: "What is the capital of Australia?",
            answers: [
                { _id: "a1", text: "Sydney", isCorrect: false },
                { _id: "a2", text: "Melbourne", isCorrect: false },
                { _id: "a3", text: "Canberra", isCorrect: true },
                { _id: "a4", text: "Brisbane", isCorrect: false },
            ],
        },
        {
            id: "geo3",
            text: "Which desert is the largest in the world?",
            answers: [
                { _id: "a1", text: "Sahara", isCorrect: true },
                { _id: "a2", text: "Gobi", isCorrect: false },
                { _id: "a3", text: "Kalahari", isCorrect: false },
                { _id: "a4", text: "Arctic", isCorrect: false },
            ],
        },
        {
            id: "geo4",
            text: "Through which continent does the Nile River flow?",
            answers: [
                { _id: "a1", text: "Asia", isCorrect: false },
                { _id: "a2", text: "Africa", isCorrect: true },
                { _id: "a3", text: "Europe", isCorrect: false },
                { _id: "a4", text: "South America", isCorrect: false },
            ],
        },
        {
            id: "geo5",
            text: "Which country has the most islands?",
            answers: [
                { _id: "a1", text: "Indonesia", isCorrect: false },
                { _id: "a2", text: "Canada", isCorrect: false },
                { _id: "a3", text: "Sweden", isCorrect: true },
                { _id: "a4", text: "Philippines", isCorrect: false },
            ],
        },
    ],
    sports: [
        {
            id: "spo1",
            text: "How many players are on a soccer team (on the field)?",
            answers: [
                { _id: "a1", text: "9", isCorrect: false },
                { _id: "a2", text: "10", isCorrect: false },
                { _id: "a3", text: "11", isCorrect: true },
                { _id: "a4", text: "12", isCorrect: false },
            ],
        },
        {
            id: "spo2",
            text: "In which sport do you use a shuttlecock?",
            answers: [
                { _id: "a1", text: "Tennis", isCorrect: false },
                { _id: "a2", text: "Badminton", isCorrect: true },
                { _id: "a3", text: "Squash", isCorrect: false },
                { _id: "a4", text: "Volleyball", isCorrect: false },
            ],
        },
        {
            id: "spo3",
            text: "What country has won the most World Cups in soccer?",
            answers: [
                { _id: "a1", text: "Germany", isCorrect: false },
                { _id: "a2", text: "Argentina", isCorrect: false },
                { _id: "a3", text: "Brazil", isCorrect: true },
                { _id: "a4", text: "Italy", isCorrect: false },
            ],
        },
        {
            id: "spo4",
            text: "What sport does Serena Williams play?",
            answers: [
                { _id: "a1", text: "Basketball", isCorrect: false },
                { _id: "a2", text: "Tennis", isCorrect: true },
                { _id: "a3", text: "Golf", isCorrect: false },
                { _id: "a4", text: "Swimming", isCorrect: false },
            ],
        },
        {
            id: "spo5",
            text: "Which country hosted the 2016 Summer Olympics?",
            answers: [
                { _id: "a1", text: "China", isCorrect: false },
                { _id: "a2", text: "Brazil", isCorrect: true },
                { _id: "a3", text: "UK", isCorrect: false },
                { _id: "a4", text: "Japan", isCorrect: false },
            ],
        },
    ],
    art: [
        {
            id: "art1",
            text: "Who painted the Mona Lisa?",
            answers: [
                { _id: "a1", text: "Vincent van Gogh", isCorrect: false },
                { _id: "a2", text: "Pablo Picasso", isCorrect: false },
                { _id: "a3", text: "Leonardo da Vinci", isCorrect: true },
                { _id: "a4", text: "Michelangelo", isCorrect: false },
            ],
        },
        {
            id: "art2",
            text: "Which artist is known for the painting 'Starry Night'?",
            answers: [
                { _id: "a1", text: "Vincent van Gogh", isCorrect: true },
                { _id: "a2", text: "Claude Monet", isCorrect: false },
                { _id: "a3", text: "Salvador Dalí", isCorrect: false },
                { _id: "a4", text: "Edvard Munch", isCorrect: false },
            ],
        },
        {
            id: "art3",
            text: "The sculpture 'David' was created by which artist?",
            answers: [
                { _id: "a1", text: "Donatello", isCorrect: false },
                { _id: "a2", text: "Michelangelo", isCorrect: true },
                { _id: "a3", text: "Raphael", isCorrect: false },
                { _id: "a4", text: "Bernini", isCorrect: false },
            ],
        },
        {
            id: "art4",
            text: "Which art movement is Salvador Dalí associated with?",
            answers: [
                { _id: "a1", text: "Cubism", isCorrect: false },
                { _id: "a2", text: "Impressionism", isCorrect: false },
                { _id: "a3", text: "Surrealism", isCorrect: true },
                { _id: "a4", text: "Baroque", isCorrect: false },
            ],
        },
        {
            id: "art5",
            text: "Which artist is known for 'The Persistence of Memory'?",
            answers: [
                { _id: "a1", text: "Dalí", isCorrect: true },
                { _id: "a2", text: "Picasso", isCorrect: false },
                { _id: "a3", text: "Kandinsky", isCorrect: false },
                { _id: "a4", text: "Warhol", isCorrect: false },
            ],
        },
    ],
}
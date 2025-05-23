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
                { id: "a1", text: "H2O", isCorrect: true },
                { id: "a2", text: "O2", isCorrect: false },
                { id: "a3", text: "CO2", isCorrect: false },
                { id: "a4", text: "NaCl", isCorrect: false },
            ],
        },
        {
            id: "sci2",
            text: "What planet is known as the Red Planet?",
            answers: [
                { id: "a1", text: "Mars", isCorrect: true },
                { id: "a2", text: "Jupiter", isCorrect: false },
                { id: "a3", text: "Saturn", isCorrect: false },
                { id: "a4", text: "Venus", isCorrect: false },
            ],
        },
        {
            id: "sci3",
            text: "Which gas do plants absorb from the atmosphere?",
            answers: [
                { id: "a1", text: "Oxygen", isCorrect: false },
                { id: "a2", text: "Carbon dioxide", isCorrect: true },
                { id: "a3", text: "Hydrogen", isCorrect: false },
                { id: "a4", text: "Nitrogen", isCorrect: false },
            ],
        },
        {
            id: "sci4",
            text: "What part of the cell contains the genetic material?",
            answers: [
                { id: "a1", text: "Cytoplasm", isCorrect: false },
                { id: "a2", text: "Nucleus", isCorrect: true },
                { id: "a3", text: "Cell wall", isCorrect: false },
                { id: "a4", text: "Ribosome", isCorrect: false },
            ],
        },
        {
            id: "sci5",
            text: "What force keeps planets in orbit around the sun?",
            answers: [
                { id: "a1", text: "Magnetism", isCorrect: false },
                { id: "a2", text: "Inertia", isCorrect: false },
                { id: "a3", text: "Gravity", isCorrect: true },
                { id: "a4", text: "Friction", isCorrect: false },
            ],
        },
    ],
    history: [
        {
            id: "his1",
            text: "Who was the first President of the United States?",
            answers: [
                { id: "a1", text: "Thomas Jefferson", isCorrect: false },
                { id: "a2", text: "George Washington", isCorrect: true },
                { id: "a3", text: "Abraham Lincoln", isCorrect: false },
                { id: "a4", text: "John Adams", isCorrect: false },
            ],
        },
        {
            id: "his2",
            text: "In which year did World War II end?",
            answers: [
                { id: "a1", text: "1940", isCorrect: false },
                { id: "a2", text: "1945", isCorrect: true },
                { id: "a3", text: "1939", isCorrect: false },
                { id: "a4", text: "1950", isCorrect: false },
            ],
        },
        {
            id: "his3",
            text: "Which empire built the Colosseum?",
            answers: [
                { id: "a1", text: "Greek", isCorrect: false },
                { id: "a2", text: "Roman", isCorrect: true },
                { id: "a3", text: "Ottoman", isCorrect: false },
                { id: "a4", text: "Byzantine", isCorrect: false },
            ],
        },
        {
            id: "his4",
            text: "Who discovered America in 1492?",
            answers: [
                { id: "a1", text: "Vasco da Gama", isCorrect: false },
                { id: "a2", text: "Christopher Columbus", isCorrect: true },
                { id: "a3", text: "Ferdinand Magellan", isCorrect: false },
                { id: "a4", text: "Hernán Cortés", isCorrect: false },
            ],
        },
        {
            id: "his5",
            text: "Where did the Industrial Revolution begin?",
            answers: [
                { id: "a1", text: "Germany", isCorrect: false },
                { id: "a2", text: "France", isCorrect: false },
                { id: "a3", text: "United Kingdom", isCorrect: true },
                { id: "a4", text: "United States", isCorrect: false },
            ],
        },
    ],
    geography: [
        {
            id: "geo1",
            text: "What is the largest continent?",
            answers: [
                { id: "a1", text: "Africa", isCorrect: false },
                { id: "a2", text: "Asia", isCorrect: true },
                { id: "a3", text: "Europe", isCorrect: false },
                { id: "a4", text: "North America", isCorrect: false },
            ],
        },
        {
            id: "geo2",
            text: "What is the capital of Australia?",
            answers: [
                { id: "a1", text: "Sydney", isCorrect: false },
                { id: "a2", text: "Melbourne", isCorrect: false },
                { id: "a3", text: "Canberra", isCorrect: true },
                { id: "a4", text: "Brisbane", isCorrect: false },
            ],
        },
        {
            id: "geo3",
            text: "Which desert is the largest in the world?",
            answers: [
                { id: "a1", text: "Sahara", isCorrect: true },
                { id: "a2", text: "Gobi", isCorrect: false },
                { id: "a3", text: "Kalahari", isCorrect: false },
                { id: "a4", text: "Arctic", isCorrect: false },
            ],
        },
        {
            id: "geo4",
            text: "Through which continent does the Nile River flow?",
            answers: [
                { id: "a1", text: "Asia", isCorrect: false },
                { id: "a2", text: "Africa", isCorrect: true },
                { id: "a3", text: "Europe", isCorrect: false },
                { id: "a4", text: "South America", isCorrect: false },
            ],
        },
        {
            id: "geo5",
            text: "Which country has the most islands?",
            answers: [
                { id: "a1", text: "Indonesia", isCorrect: false },
                { id: "a2", text: "Canada", isCorrect: false },
                { id: "a3", text: "Sweden", isCorrect: true },
                { id: "a4", text: "Philippines", isCorrect: false },
            ],
        },
    ],
    sports: [
        {
            id: "spo1",
            text: "How many players are on a soccer team (on the field)?",
            answers: [
                { id: "a1", text: "9", isCorrect: false },
                { id: "a2", text: "10", isCorrect: false },
                { id: "a3", text: "11", isCorrect: true },
                { id: "a4", text: "12", isCorrect: false },
            ],
        },
        {
            id: "spo2",
            text: "In which sport do you use a shuttlecock?",
            answers: [
                { id: "a1", text: "Tennis", isCorrect: false },
                { id: "a2", text: "Badminton", isCorrect: true },
                { id: "a3", text: "Squash", isCorrect: false },
                { id: "a4", text: "Volleyball", isCorrect: false },
            ],
        },
        {
            id: "spo3",
            text: "What country has won the most World Cups in soccer?",
            answers: [
                { id: "a1", text: "Germany", isCorrect: false },
                { id: "a2", text: "Argentina", isCorrect: false },
                { id: "a3", text: "Brazil", isCorrect: true },
                { id: "a4", text: "Italy", isCorrect: false },
            ],
        },
        {
            id: "spo4",
            text: "What sport does Serena Williams play?",
            answers: [
                { id: "a1", text: "Basketball", isCorrect: false },
                { id: "a2", text: "Tennis", isCorrect: true },
                { id: "a3", text: "Golf", isCorrect: false },
                { id: "a4", text: "Swimming", isCorrect: false },
            ],
        },
        {
            id: "spo5",
            text: "Which country hosted the 2016 Summer Olympics?",
            answers: [
                { id: "a1", text: "China", isCorrect: false },
                { id: "a2", text: "Brazil", isCorrect: true },
                { id: "a3", text: "UK", isCorrect: false },
                { id: "a4", text: "Japan", isCorrect: false },
            ],
        },
    ],
    art: [
        {
            id: "art1",
            text: "Who painted the Mona Lisa?",
            answers: [
                { id: "a1", text: "Vincent van Gogh", isCorrect: false },
                { id: "a2", text: "Pablo Picasso", isCorrect: false },
                { id: "a3", text: "Leonardo da Vinci", isCorrect: true },
                { id: "a4", text: "Michelangelo", isCorrect: false },
            ],
        },
        {
            id: "art2",
            text: "Which artist is known for the painting 'Starry Night'?",
            answers: [
                { id: "a1", text: "Vincent van Gogh", isCorrect: true },
                { id: "a2", text: "Claude Monet", isCorrect: false },
                { id: "a3", text: "Salvador Dalí", isCorrect: false },
                { id: "a4", text: "Edvard Munch", isCorrect: false },
            ],
        },
        {
            id: "art3",
            text: "The sculpture 'David' was created by which artist?",
            answers: [
                { id: "a1", text: "Donatello", isCorrect: false },
                { id: "a2", text: "Michelangelo", isCorrect: true },
                { id: "a3", text: "Raphael", isCorrect: false },
                { id: "a4", text: "Bernini", isCorrect: false },
            ],
        },
        {
            id: "art4",
            text: "Which art movement is Salvador Dalí associated with?",
            answers: [
                { id: "a1", text: "Cubism", isCorrect: false },
                { id: "a2", text: "Impressionism", isCorrect: false },
                { id: "a3", text: "Surrealism", isCorrect: true },
                { id: "a4", text: "Baroque", isCorrect: false },
            ],
        },
        {
            id: "art5",
            text: "Which artist is known for 'The Persistence of Memory'?",
            answers: [
                { id: "a1", text: "Dalí", isCorrect: true },
                { id: "a2", text: "Picasso", isCorrect: false },
                { id: "a3", text: "Kandinsky", isCorrect: false },
                { id: "a4", text: "Warhol", isCorrect: false },
            ],
        },
    ],
}
export const shuffleArray = (array: any[])=>  //randomizer function
[...array].sort(() => Math.random() - 0.5);
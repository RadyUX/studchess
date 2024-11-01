const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
    
        await db.opening.deleteMany({});

      
        await db.opening.createMany({
            data: [
                {name: "Ruy Lopez", moves: 'e4 e5 Cf3 Cc6 Fb5', category: "agressive", image: "https://i.imgur.com/tPfH6OG.jpeg"},
                {name: "Sicilian", moves:'e4 c5', category: "agressive", image: "https://i.imgur.com/nSvSQ6h.jpeg"},
                {name: "Caro Kann", moves:'e4 c6', category: "solid", image: "https://i.imgur.com/5XqJpRz.jpeg"},
                {name: "Dutch", moves:'e4 f5', category: "agressive", image: "https://i.imgur.com/jWJjWVC.jpeg"},
                {name: "Bird", moves:'f4', category: "agressive", image: "https://i.imgur.com/oJr4hEk.jpeg"},
                {name: "Queen's Gambit", moves:'d4 d6 c4', category: "gambit", image: "https://i.imgur.com/cNgGE9v.jpeg"},
              
            ]
        });
    } catch (error) {
        console.log(error);
    } finally {
        await db.$disconnect();
    }
}

main();

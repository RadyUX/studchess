const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        // Supprime toutes les données précédentes
        await db.opening.deleteMany({});
        await db.variation.deleteMany({});

        // Ajoute de nouvelles ouvertures
        await db.opening.createMany({
            data: [
                { name: "Ruy Lopez", moves: 'e4 e5 Cf3 Cc6 Fb5', category: "agressive", image: "https://i.imgur.com/tPfH6OG.jpeg" },
                { name: "Sicilian", moves: 'e4 c5', category: "agressive", image: "https://i.imgur.com/nSvSQ6h.jpeg" },
                { name: "Caro Kann", moves: 'e4 c6', category: "solid", image: "https://i.imgur.com/5XqJpRz.jpeg" },
                { name: "Dutch", moves: 'e4 f5', category: "agressive", image: "https://i.imgur.com/jWJjWVC.jpeg" },
                { name: "Bird", moves: 'f4', category: "agressive", image: "https://i.imgur.com/oJr4hEk.jpeg" },
                { name: "Queen's Gambit", moves: 'd4 d6 c4', category: "gambit", image: "https://i.imgur.com/cNgGE9v.jpeg" },
            ]
        });

        const createdOpenings = await db.opening.findMany();

        // Ajout de variantes aux ouvertures
        for (const opening of createdOpenings) {
            if (opening.name === "Ruy Lopez") {
                await db.variation.createMany({
                    data: [
                        {
                            moves: "e4 e5 Cf3 Cc6 Fb5 a6 Fa4 Cf6 O-O Fe7",
                            notes: "Variante Morphy, qui est l'une des lignes principales.",
                            openingId: opening.id,
                        },
                        {
                            moves: "e4 e5 Cf3 Cc6 Fb5 d6",
                            notes: "Variante Steinitz, qui est une ligne plus passive.",
                            openingId: opening.id,
                        },
                        {
                            moves: "e4 e5 Cf3 Cc6 Fb5 f5",
                            notes: "Variante Schliemann, qui mène à un jeu très tactique.",
                            openingId: opening.id,
                        },
                    ],
                });
            } else if (opening.name === "Sicilian") {
                await db.variation.createMany({
                    data: [
                        {
                            moves: "e4 c5 Cf3 d6 d4 cxd4 Cxd4 Cf6",
                            notes: "Défense Sicilienne classique, qui est très populaire chez les joueurs d'élite.",
                            openingId: opening.id,
                        },
                        {
                            moves: "e4 c5 Cf3 e6 d4 cxd4",
                            notes: "Variante Paulsen, qui donne beaucoup de flexibilité aux noirs.",
                            openingId: opening.id,
                        },
                        {
                            moves: "e4 c5 d4 cxd4 Cxd4 Cf6 Cc3 a6",
                            notes: "Variante Najdorf, l'une des lignes les plus célèbres et complexes.",
                            openingId: opening.id,
                        },
                    ],
                });
            } else if (opening.name === "Caro Kann") {
                await db.variation.createMany({
                    data: [
                        {
                            moves: "e4 c6 d4 d5 e5",
                            notes: "Variante Avancée, souvent utilisée pour attaquer rapidement.",
                            openingId: opening.id,
                        },
                        {
                            moves: "e4 c6 d4 d5 exd5 cxd5 Cf3",
                            notes: "Variante d'échange, conduisant à une position symétrique.",
                            openingId: opening.id,
                        },
                        {
                            moves: "e4 c6 d4 d5 Cc3",
                            notes: "Variante des deux cavaliers, donnant aux blancs plus de contrôle central.",
                            openingId: opening.id,
                        },
                    ],
                });
            } else if (opening.name === "Dutch") {
                await db.variation.createMany({
                    data: [
                        {
                            moves: "d4 f5 c4 Cf6 g3",
                            notes: "Variante Leningrad, un système dynamique et agressif.",
                            openingId: opening.id,
                        },
                        {
                            moves: "d4 f5 Cf3 Cf6 g3 e6",
                            notes: "Variante Classique, qui vise un jeu solide.",
                            openingId: opening.id,
                        },
                        {
                            moves: "d4 f5 Cc3",
                            notes: "Variante Staunton Gambit, une tentative agressive de contrôler le centre.",
                            openingId: opening.id,
                        },
                    ],
                });
            } else if (opening.name === "Bird") {
                await db.variation.createMany({
                    data: [
                        {
                            moves: "f4 d5 Cf3 Cf6",
                            notes: "Variante Classique de Bird, visant à créer une pression sur le centre.",
                            openingId: opening.id,
                        },
                        {
                            moves: "f4 e5",
                            notes: "Gambit From, une réponse agressive des noirs.",
                            openingId: opening.id,
                        },
                        {
                            moves: "f4 d5 g3",
                            notes: "Fianchetto, une approche calme pour contrôler le centre.",
                            openingId: opening.id,
                        },
                    ],
                });
            } else if (opening.name === "Queen's Gambit") {
                await db.variation.createMany({
                    data: [
                        {
                            moves: "d4 d5 c4 e6 Cc3 Cf6",
                            notes: "Variante du Gambit Refusé, la ligne principale.",
                            openingId: opening.id,
                        },
                        {
                            moves: "d4 d5 c4 dxc4",
                            notes: "Variante du Gambit Accepté, où les noirs acceptent de prendre le pion.",
                            openingId: opening.id,
                        },
                        {
                            moves: "d4 d5 c4 c6",
                            notes: "Variante Slave, qui vise une défense solide.",
                            openingId: opening.id,
                        },
                    ],
                });
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        await db.$disconnect();
    }
}

main();

require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255),
length INT,
description VARCHAR(1000), 
price DECIMAL(4, 2),
rating DECIMAL(2, 1), 
quantity INT,
src VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS actors (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
firstName VARCHAR(255), 
lastName VARCHAR(255), 
birthdate DATE, 
country CHAR(2),
src VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS genres (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
genre VARCHAR(255),
src VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS inventory (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
movie INT REFERENCES movies(id),
actor INT REFERENCES actors(id),
genre INT REFERENCES genres(id)
);

INSERT INTO movies (title, length, description, price, rating, quantity)
VALUES ('Mission Impossible', 110, 'When Ethan Hunt, the leader of a crack espionage team whose perilous operation has gone awry with no explanation, discovers that a mole has penetrated the CIA, he''s surprised to learn that he''s the prime suspect. To clear his name, Hunt now must ferret out the real double agent and, in the process, even the score.', 10.99, 7.2, 12),
('Once Upon A Time... In Hollywood', 162, 'As Hollywood''s Golden Age is winding down during the summer of 1969, television actor Rick Dalton and his stunt double Cliff Booth endeavor to achieve lasting success in Hollywood while meeting several colorful characters along the way.', 19.99, 7.8, 48),
('Inception', 148, 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.', 29.99, 8.8, 8),
('Interstellar', 169, 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.', 10.99, 8.7, 6),
('Fight Club', 139, 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', 9.99, 8.8, 3),
('Forrest Gump', 142, 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.', 5.99, 8.8, 5),
('No Time To Die', 163, 'James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.', 10.99, 7.3, 8),
('Anyone But You', 103, 'After an amazing first date, Bea and Ben''s fiery attraction turns ice-cold--until they find themselves unexpectedly reunited at a wedding in Australia. So they do what any two mature adults would do: pretend to be a couple.', 3.99, 6.1, 29),
('Spider-Man: Homecoming', 133, 'Peter Parker tries to stop Adrian ''The Vulture'' Toomes from selling weapons made with advanced Chitauri technology while trying to balance his life as an ordinary high school student.', 3.99, 7.4, 3),
('Grown Ups', 102, 'After their high school basketball coach passes away, five good friends and former teammates reunite for a Fourth of July holiday weekend.', 1.99, 6.0, 2),
('Mr. & Mrs. Smith', 120, 'A husband and wife struggle to keep their marriage alive until they realize they are both secretly working as assassins. Now, their respective assignments require them to kill each other.', 6.99, 6.5, 5),
('The Fantastic Four: First Steps', 115, 'Forced to balance their roles as heroes with the strength of their family bond, the Fantastic Four must defend Earth from a ravenous space god called Galactus and his enigmatic Herald, Silver Surfer.', 10.99, 7.5, 18),
('Bird Box', 124, 'Five years after an ominous unseen presence drives most of society to suicide, a mother and her two children make a desperate bid to reach safety.', 7.99, 6.6, 15);

INSERT INTO actors (firstName, lastName, birthdate, country)
VALUES ('Tom', 'Cruise', '1962-07-03', 'US'),
('Leonardo', 'DiCaprio', '1974-11-11', 'US'),
('Pedro', 'Pascal', '1975-04-02', 'CL'),
('Sandra', 'Bullock', '1964-07-26', 'US'),
('Sydney', 'Sweeney', '1997-09-12', 'US'),
('Angelina', 'Jolie', '1975-06-04', 'US'),
('Ana', 'de Armas', '1988-04-30', 'CU'),
('Adam', 'Sandler', '1966-09-09', 'US'),
('Brad', 'Pitt', '1963-12-18', 'US'),
('Zendaya', 'Coleman', '1996-09-01', 'US');

INSERT INTO genres (genre)
VALUES('Comedy'),
('Thriller'),
('Action'),
('Drama'),
('Science Fiction'),
('Horror'),
('Romance'),
('Documentary');
`;

const main = async () => {
    console.log("...seeding");
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
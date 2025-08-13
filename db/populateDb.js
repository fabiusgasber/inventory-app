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

CREATE TABLE IF NOT EXISTS movie_genres (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
movieId INTEGER,
genreId INTEGER,
FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
FOREIGN KEY (genreId) REFERENCES genres(id) ON DELETE CASCADE,
UNIQUE (movieId)
);

CREATE TABLE IF NOT EXISTS movie_actors (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
movieId INTEGER,
actorId INTEGER,
FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
FOREIGN KEY (actorId) REFERENCES actors(id) ON DELETE CASCADE,
UNIQUE (movieId, actorId)
);

INSERT INTO movies (title, length, description, price, rating, quantity, src)
VALUES ('Mission Impossible', 110, 'When Ethan Hunt, the leader of a crack espionage team whose perilous operation has gone awry with no explanation, discovers that a mole has penetrated the CIA, he''s surprised to learn that he''s the prime suspect. To clear his name, Hunt now must ferret out the real double agent and, in the process, even the score.', 10.99, 7.2, 6, '/movie-posters/mission-impossible.jpg'),
('Once Upon A Time... In Hollywood', 162, 'As Hollywood''s Golden Age is winding down during the summer of 1969, television actor Rick Dalton and his stunt double Cliff Booth endeavor to achieve lasting success in Hollywood while meeting several colorful characters along the way.', 19.99, 7.8, 8, '/movie-posters/once-upon.jpg'),
('Inception', 148, 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.', 29.99, 8.8, 8, '/movie-posters/inception.jpg'),
('Interstellar', 169, 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.', 10.99, 8.7, 6, '/movie-posters/interstellar.jpg'),
('Fight Club', 139, 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', 9.99, 8.8, 3, '/movie-posters/fightclub.jpg'),
('Forrest Gump', 142, 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.', 5.99, 8.8, 5, '/movie-posters/forrest-gump.jpg'),
('No Time To Die', 163, 'James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.', 10.99, 7.3, 8, '/movie-posters/no-time-to-die.jpg'),
('Anyone But You', 103, 'After an amazing first date, Bea and Ben''s fiery attraction turns ice-cold--until they find themselves unexpectedly reunited at a wedding in Australia. So they do what any two mature adults would do: pretend to be a couple.', 3.99, 6.1, 2, '/movie-posters/anyone-but-you.jpg'),
('Spider-Man: Homecoming', 133, 'Peter Parker tries to stop Adrian ''The Vulture'' Toomes from selling weapons made with advanced Chitauri technology while trying to balance his life as an ordinary high school student.', 3.99, 7.4, 3, '/movie-posters/spiderman.jpg'),
('Grown Ups', 102, 'After their high school basketball coach passes away, five good friends and former teammates reunite for a Fourth of July holiday weekend.', 1.99, 6.0, 2, '/movie-posters/grown-ups.jpg'),
('Mr. & Mrs. Smith', 120, 'A husband and wife struggle to keep their marriage alive until they realize they are both secretly working as assassins. Now, their respective assignments require them to kill each other.', 6.99, 6.5, 5, '/movie-posters/smith.jpg'),
('The Fantastic Four: First Steps', 115, 'Forced to balance their roles as heroes with the strength of their family bond, the Fantastic Four must defend Earth from a ravenous space god called Galactus and his enigmatic Herald, Silver Surfer.', 10.99, 7.5, 10, '/movie-posters/fantastic-four.jpeg'),
('Bird Box', 124, 'Five years after an ominous unseen presence drives most of society to suicide, a mother and her two children make a desperate bid to reach safety.', 7.99, 6.6, 5, '/movie-posters/birdbox.jpg');

INSERT INTO actors (firstName, lastName, birthdate, country, src)
VALUES ('Tom', 'Cruise', '1962-07-03', 'US', '/actors/cruise.jpg'),
('Leonardo', 'DiCaprio', '1974-11-11', 'US', '/actors/dicaprio.jpg'),
('Pedro', 'Pascal', '1975-04-02', 'CL', '/actors/pascal.jpg'),
('Sandra', 'Bullock', '1964-07-26', 'US', '/actors/bullock.jpg'),
('Sydney', 'Sweeney', '1997-09-12', 'US', '/actors/sweeney.jpg'),
('Angelina', 'Jolie', '1975-06-04', 'US', '/actors/jolie.jpg'),
('Ana', 'de Armas', '1988-04-30', 'CU', '/actors/armas.jpg'),
('Adam', 'Sandler', '1966-09-09', 'US', '/actors/sandler.jpg'),
('Brad', 'Pitt', '1963-12-18', 'US', '/actors/pitt.jpg'),
('Zendaya', 'Coleman', '1996-09-01', 'US', '/actors/zendaya.jpg');

INSERT INTO genres (genre, src)
VALUES('Comedy', '/genres/comedy.jpg'),
('Thriller', '/genres/thriller.jpg'),
('Action', '/genres/action.jpg'),
('Drama', '/genres/drama.jpg'),
('Science Fiction', '/genres/scifi.jpg'),
('Horror', '/genres/horror.jpg'),
('Romance', '/genres/romance.jpg'),
('Documentary', '/genres/documentary.jpg');

INSERT INTO movie_actors (movieId, actorId)
VALUES
(1, 1),
(3, 2),
(5, 9),
(7, 7),
(9, 10),
(10, 1),
(11, 6),
(13, 4);

INSERT INTO movie_genres (movieId, genreId)
VALUES
(1, 3),
(2, 1),
(3, 5),
(4, 5),
(5, 4),
(6, 4),
(7, 3),
(8, 7),
(9, 3),
(10, 8),
(11, 3),
(12, 3),
(13, 6);
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
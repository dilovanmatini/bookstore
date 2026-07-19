USE bookstore;

-- Password for all seed users: password123
-- Hash generated with bcrypt (cost 10)

INSERT INTO users (name, email, password, phone, role, is_active) VALUES
('Admin', 'admin@bookstore.com', '$2b$10$ULEkWpL7Sq5MwmPHeM354ONTiz9iUf4K1VI5a7bmIIt1t6zTes/wq', '9647501112233', 'admin', 1),
('Dilovan Matini', 'dilovan@example.com', '$2b$10$ULEkWpL7Sq5MwmPHeM354ONTiz9iUf4K1VI5a7bmIIt1t6zTes/wq', '9647501112266', 'user', 1),
('John Smith', 'john@example.com', '$2b$10$ULEkWpL7Sq5MwmPHeM354ONTiz9iUf4K1VI5a7bmIIt1t6zTes/wq', '9647501112255', 'user', 1),
('Banned User', 'banned@example.com', '$2b$10$ULEkWpL7Sq5MwmPHeM354ONTiz9iUf4K1VI5a7bmIIt1t6zTes/wq', '9647501112244', 'user', 0);

INSERT INTO categories (name) VALUES
('Fiction'),
('Non-Fiction'),
('Mystery & Thriller'),
('Science Fiction'),
('Fantasy'),
('Romance'),
('Horror'),
('Biography & Memoir'),
('History'),
('Science & Technology'),
('Business & Economics'),
('Self-Help'),
('Children'),
('Young Adult'),
('Poetry'),
('Comics & Graphic Novels'),
('Art & Design'),
('Cooking'),
('Travel'),
('Religion & Spirituality'),
('Health & Wellness'),
('Education'),
('Philosophy'),
('Politics'),
('Sports');

INSERT INTO books (category_id, title, description, author, isbn, published_at, price, image) VALUES
(1, 'The Silent Harbor', 'A sweeping family saga set in a coastal town.', 'Elena Marsh', '978-1000000001', '2019-03-12', 14.99, NULL),
(1, 'Autumn Letters', 'Letters discovered in an attic change three generations.', 'Marcus Cole', '978-1000000002', '2021-09-01', 12.50, NULL),
(3, 'Night Watch Protocol', 'A detective races to stop a city-wide conspiracy.', 'Ava Quinn', '978-1000000003', '2020-06-18', 16.99, NULL),
(3, 'Glass Knife', 'A locked-room mystery in a luxury hotel.', 'Noah Briggs', '978-1000000004', '2022-01-25', 15.00, NULL),
(4, 'Orbit Zero', 'The first colony ship loses contact with Earth.', 'Priya Nair', '978-1000000005', '2018-11-08', 18.99, NULL),
(4, 'Carbon Ghosts', 'AI minds awaken inside abandoned satellites.', 'Leo Hart', '978-1000000006', '2023-04-14', 19.50, NULL),
(5, 'Crown of Embers', 'A banished mage must reclaim a stolen throne.', 'Sera Vale', '978-1000000007', '2017-05-30', 17.99, NULL),
(5, 'The Last Cartographer', 'Maps that rewrite reality fall into the wrong hands.', 'Tom Reed', '978-1000000008', '2024-02-02', 21.00, NULL),
(6, 'Coffee at Midnight', 'Two rivals share one cafe and a complicated past.', 'Lila Brooks', '978-1000000009', '2021-02-14', 11.99, NULL),
(7, 'House on Hollow Lane', 'A family inherits a house that remembers everything.', 'Gideon Cross', '978-1000000010', '2016-10-31', 13.75, NULL),
(8, 'Built From Scratch', 'Memoir of a founder who started with nothing.', 'Hannah Lee', '978-1000000011', '2020-08-20', 22.00, NULL),
(9, 'Empire of Roads', 'How trade routes reshaped the ancient world.', 'Omar Farid', '978-1000000012', '2015-04-09', 24.50, NULL),
(10, 'The Quantum Kitchen', 'Everyday explanations of modern physics.', 'Dr. Kim Sato', '978-1000000013', '2022-07-11', 20.00, NULL),
(11, 'Ship It Twice', 'Practical lessons from scaling a product company.', 'Chris Nolan', '978-1000000014', '2019-12-03', 27.99, NULL),
(12, 'Tiny Habits, Big Days', 'A gentle system for sustainable change.', 'Maya Ortiz', '978-1000000015', '2023-01-10', 14.00, NULL),
(13, 'Bunny and the Blue Balloon', 'A picture book about courage and friendship.', 'Rita Pang', '978-1000000016', '2018-05-01', 9.99, NULL),
(14, 'Stars Over Juniortown', 'Teens uncover a secret society in their school.', 'Jordan Blake', '978-1000000017', '2021-11-16', 12.99, NULL),
(15, 'River of Quiet Voices', 'A collection of poems about home and leaving.', 'Amira Sol', '978-1000000018', '2014-09-22', 10.50, NULL),
(16, 'Ink & Iron Vol. 1', 'A graphic novel about rival blacksmith guilds.', 'Dez Carter', '978-1000000019', '2020-03-07', 16.50, NULL),
(18, 'Sunday Soup Club', 'Forty comforting recipes for shared tables.', 'Nina Alvarez', '978-1000000020', '2022-10-05', 28.00, NULL);

INSERT INTO favorites (user_id, book_id) VALUES
(2, 1),
(2, 5),
(2, 7),
(3, 3),
(3, 9);

INSERT INTO orders (user_id, status, total_price, address) VALUES
(2, 'pending', 31.98, '12 Oak Street, Springfield'),
(2, 'delivered', 18.99, '12 Oak Street, Springfield'),
(3, 'in_progress', 16.99, '88 Pine Avenue, Riverton');

INSERT INTO order_items (order_id, book_id, quantity, price) VALUES
(1, 1, 1, 14.99),
(1, 9, 1, 11.99),
(2, 5, 1, 18.99),
(3, 3, 1, 16.99);

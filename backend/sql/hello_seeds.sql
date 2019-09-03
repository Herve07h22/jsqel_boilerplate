INSERT INTO Hello (id, message) VALUES (1, 'Hello world') ON CONFLICT DO NOTHING;
INSERT INTO Hello (id, message) VALUES (2, 'Bonjour le monde') ON CONFLICT DO NOTHING;


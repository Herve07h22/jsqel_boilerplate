
INSERT INTO opportunities(label, amount, probability) VALUES ('New CRM software', 10000, 'hard') ON CONFLICT DO NOTHING;
INSERT INTO opportunities(label, amount, probability) VALUES ('Adding new functions to home-made ERP', 6000, 'good') ON CONFLICT DO NOTHING;

INSERT INTO leads(email, first_name, last_name, opportunity_id) VALUES ('jdoe@fictivedomain.com', 'John', 'Doe', 1) ON CONFLICT DO NOTHING;
INSERT INTO leads(email, first_name, last_name, opportunity_id) VALUES ('sarah@fictivedomain.com', 'Sarah', 'Connor', 1) ON CONFLICT DO NOTHING;
INSERT INTO leads(email, first_name, last_name, opportunity_id) VALUES ('bill@fictivedomain.com', 'Bill', 'Ly', 2) ON CONFLICT DO NOTHING;


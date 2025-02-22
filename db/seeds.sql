-- Données de test
INSERT INTO ENTREPRISE (nom_entreprise, raison_sociale, forme_juridique, numero_siret, adresse, code_postal, ville, pays, telephone, email, site_web, secteur_activite, effectif, capital_social, lien_image_entreprise, code_entreprise, date_creation_entreprise, date_modification_entreprise) VALUES 
('Tech Innov', 'Tech Innovations SARL', 'SARL', '12345678901234', '10 Rue des Entrepreneurs', '75001', 'Paris', 'France', '0123456789', 'contact@techinnov.fr', 'https://www.techinnov.fr', 'Technologie', 50, 100000, 'https://www.techinnov.fr/logo.png', 'TECH123', '2023-01-01', '2025-01-14'),
('Green Solutions', 'Green Solutions SAS', 'SAS', '98765432109876', '20 Avenue de lEcologie', '13001', 'Marseille', 'France', '0987654321', 'contact@greensolutions.fr', 'https://www.greensolutions.fr', 'Environnement', 120, 500000, 'https://www.greensolutions.fr/logo.png', 'GREEN123', '2020-06-15', '2025-01-14');

INSERT INTO SITE (nom_site, adresse, code_postal, ville, pays, telephone, email, site_web, lien_image_site, id_entreprise, date_creation_site, date_modification_site) VALUES 
('Site Paris', '10 Rue des Entrepreneurs', '75001', 'Paris', 'France', '0123456789', 'contact@techinnov.fr', 'https://www.techinnov.fr', 'https://www.techinnov.fr/site_paris.png', 1, '2023-01-01', '2025-01-14'),
('Site Marseille', '20 Avenue de l\Ecologie', '13001', 'Marseille', 'France', '0987654321', 'contact@greensolutions.fr', 'https://www.greensolutions.fr', 'https://www.greensolutions.fr/site_marseille.png', 2, '2020-06-15', '2025-01-14');

INSERT INTO UTILISATEUR (email, password, admin_entreprise, admin_rentecaisse, nom, prenom, date_naissance, adresse, code_postal, ville, pays, telephone, categorie_permis, lien_image_utilisateur, id_entreprise, id_site, date_creation_utilisateur, date_modification_utilisateur) VALUES 
('jean.dupont@techinnov.fr', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', TRUE, FALSE, 'Dupont', 'Jean', '1990-03-15', '15 Rue du Tech', '75002', 'Paris', 'France', '0123456789', 'B', 'https://www.techinnov.fr/jean.png', 1, 1, '2023-01-01', '2025-01-14'),
('lucie.dupont@greensolutions.fr', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', FALSE, TRUE, 'Dupont', 'Lucie', '1985-07-30', '30 Avenue du Green', '13002', 'Marseille', 'France', '0987654321', 'B', 'https://www.greensolutions.fr/lucie.png', 2, 2, '2020-06-15', '2025-01-14');

INSERT INTO VOITURES (marque, modele, année_fabrication, immatriculation, carburant, couleur, puissance, nombre_portes, nombre_places, type_boite, statut_voiture, lien_image_voiture, id_entreprise, id_site, date_creation_voiture, date_modification_voiture) VALUES 
('Tesla', 'Model 3', 2023, 'AB123CD', 'Electrique', 'Noir', 350, 4, 5, 'Automatique', 'DISPONIBLE', 'https://www.techinnov.fr/tesla_model3.png', 1, 1, '2023-01-01', '2025-01-14'),
('Renault', 'Clio', 2020, 'XY456ZT', 'Essence', 'Blanc', 90, 5, 5, 'Manuelle', 'DISPONIBLE', 'https://www.greensolutions.fr/renault_clio.png', 2, 2, '2020-06-15', '2025-01-14');

INSERT INTO CLE (statut_cle, id_voiture, id_user, id_site, date_creation_cle, date_modification_cle) VALUES 
('DISPONIBLE', 1, 1, 1, '2023-01-01', '2025-01-14'),
('DISPONIBLE', 2, 2, 2, '2020-06-15', '2025-01-14');

INSERT INTO LISTE_PASSAGER (id_utilisateur, date_creation_liste, date_modification_liste) VALUES 
(1, '2023-01-01', '2025-01-14'),
(2, '2020-06-15', '2025-01-14');

INSERT INTO LOCALISATION (nom_localisation, adresse, code_postal, ville, pays, telephone, email, site_web, added_by_sql, date_creation_localisation, date_modification_localisation) VALUES 
('Localisation Paris', '10 Rue des Entrepreneurs', '75001', 'Paris', 'France', '0123456789', 'contact@techinnov.fr', 'https://www.techinnov.fr', TRUE, '2023-01-01', '2025-01-14'),
('Localisation Marseille', '20 Avenue de l\Ecologie', '13001', 'Marseille', 'France', '0987654321', 'contact@greensolutions.fr', 'https://www.greensolutions.fr', TRUE, '2020-06-15', '2025-01-14');

INSERT INTO EMPRUNT (nom_emprunt, date_debut, date_fin, id_voiture, id_cle, statut_emprunt, id_utilisateur_demande, description, id_liste_passager, date_creation_emprunt, date_modification_emprunt) VALUES 
('Emprunt voiture Tesla', '2023-01-02 09:00:00', '2023-01-02 18:00:00', 1, 1, 'EN COURS', 1, 'Utilisation pour réunion externe', 1, '2023-01-01', '2025-01-14'),
('Emprunt voiture Clio', '2020-06-16 09:00:00', '2020-06-16 18:00:00', 2, 2, 'EN COURS', 2, 'Mission pour client', 2, '2020-06-15', '2025-01-14'); 
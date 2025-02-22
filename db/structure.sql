-- Structure de la base de données
DROP TABLE IF EXISTS EMPRUNT CASCADE;
DROP TABLE IF EXISTS CLE CASCADE;
DROP TABLE IF EXISTS LOCALISATION CASCADE;
DROP TABLE IF EXISTS LISTE_PASSAGER CASCADE;
DROP TABLE IF EXISTS VOITURES CASCADE;
DROP TABLE IF EXISTS UTILISATEUR CASCADE;
DROP TABLE IF EXISTS SITE CASCADE;
DROP TABLE IF EXISTS ENTREPRISE CASCADE;

-- Création des tables
CREATE TABLE ENTREPRISE (
    id_entreprise SERIAL PRIMARY KEY,
    nom_entreprise VARCHAR(100) NOT NULL,
    raison_sociale VARCHAR(100),
    forme_juridique VARCHAR(50) NOT NULL CHECK (forme_juridique IN ('SA', 'SARL', 'SAS', 'EURL', 'EI', 'SC', 'SCS', 'SNC')),
    numero_siret VARCHAR(14) NOT NULL UNIQUE CHECK (LENGTH(numero_siret) IN (9, 14)),
    adresse VARCHAR(100) NOT NULL CHECK (LENGTH(adresse) >= 10),
    code_postal VARCHAR(5) NOT NULL CHECK (LENGTH(code_postal) = 5),
    ville VARCHAR(50) NOT NULL CHECK (LENGTH(ville) >= 3),
    pays VARCHAR(50) NOT NULL CHECK (LENGTH(pays) >= 5),
    telephone VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    site_web VARCHAR(100) NOT NULL CHECK (site_web ~ '^(https?://)?(www.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(/[^ ]*)?$'),
    secteur_activite VARCHAR(50) NOT NULL,
    effectif INT NOT NULL CHECK (effectif > 0),
    capital_social INT NOT NULL CHECK (capital_social > 0),
    lien_image_entreprise VARCHAR(200),
    code_entreprise VARCHAR(20) NOT NULL,
    date_creation_entreprise DATE NOT NULL,
    date_modification_entreprise DATE NOT NULL
);

CREATE TABLE SITE (
    id_site SERIAL PRIMARY KEY,
    nom_site VARCHAR(50) NOT NULL,
    adresse VARCHAR(100) NOT NULL,
    code_postal VARCHAR(5) NOT NULL CHECK (LENGTH(code_postal) = 5),
    ville VARCHAR(50) NOT NULL CHECK (LENGTH(ville) >= 3),
    pays VARCHAR(50) NOT NULL CHECK (LENGTH(pays) >= 5),
    telephone VARCHAR(10) NOT NULL CHECK (LENGTH(telephone) = 10),
    email VARCHAR(100) NOT NULL CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    site_web VARCHAR(100) NOT NULL CHECK (site_web ~ '^(https?://)?(www.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(/[^ ]*)?$'),
    lien_image_site VARCHAR(200),
    id_entreprise INT NOT NULL REFERENCES ENTREPRISE(id_entreprise),
    date_creation_site DATE NOT NULL,
    date_modification_site DATE NOT NULL
);

CREATE TABLE UTILISATEUR (
    id_user SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    password VARCHAR(100) NOT NULL,
    admin_entreprise BOOLEAN NOT NULL DEFAULT FALSE,
    admin_rentecaisse BOOLEAN NOT NULL DEFAULT FALSE,
    nom VARCHAR(50) NOT NULL CHECK (LENGTH(nom) >= 3),
    prenom VARCHAR(50) NOT NULL CHECK (LENGTH(prenom) >= 3),
    date_naissance DATE NOT NULL,
    adresse VARCHAR(100) NOT NULL CHECK (LENGTH(adresse) >= 10),
    code_postal VARCHAR(5) NOT NULL CHECK (LENGTH(code_postal) = 5),
    ville VARCHAR(50) NOT NULL CHECK (LENGTH(ville) >= 3),
    pays VARCHAR(50) NOT NULL CHECK (LENGTH(pays) >= 5),
    telephone VARCHAR(10) NOT NULL,
    categorie_permis VARCHAR(20) NOT NULL,
    lien_image_utilisateur VARCHAR(200),
    id_entreprise INT REFERENCES ENTREPRISE(id_entreprise),
    id_site INT REFERENCES SITE(id_site),
    date_creation_utilisateur DATE NOT NULL,
    date_modification_utilisateur DATE NOT NULL
);

CREATE TABLE VOITURES (
    id_voiture SERIAL PRIMARY KEY,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    année_fabrication INT NOT NULL,
    immatriculation VARCHAR(20) NOT NULL UNIQUE,
    carburant VARCHAR(20) NOT NULL,
    couleur VARCHAR(20) NOT NULL,
    puissance INT NOT NULL,
    nombre_portes INT NOT NULL,
    nombre_places INT NOT NULL,
    type_boite VARCHAR(50) NOT NULL,
    statut_voiture VARCHAR(200) NOT NULL DEFAULT 'DISPONIBLE',
    lien_image_voiture VARCHAR(200),
    id_entreprise INT NOT NULL REFERENCES ENTREPRISE(id_entreprise),
    id_site INT NOT NULL REFERENCES SITE(id_site),
    date_creation_voiture DATE NOT NULL,
    date_modification_voiture DATE NOT NULL
);

CREATE TABLE CLE (
    id_cle SERIAL PRIMARY KEY,
    statut_cle VARCHAR(10) NOT NULL,
    id_voiture INT NOT NULL REFERENCES VOITURES(id_voiture),
    id_user INT REFERENCES UTILISATEUR(id_user),
    id_site INT NOT NULL REFERENCES SITE(id_site),
    date_creation_cle DATE NOT NULL,
    date_modification_cle DATE NOT NULL
);

CREATE TABLE LISTE_PASSAGER (
    id_liste_passager SERIAL PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    date_creation_liste DATE NOT NULL,
    date_modification_liste DATE NOT NULL
);

CREATE TABLE LOCALISATION (
    id_localisation SERIAL PRIMARY KEY,
    nom_localisation VARCHAR(100) NOT NULL,
    adresse VARCHAR(100) NOT NULL,
    code_postal VARCHAR(100) NOT NULL CHECK (LENGTH(code_postal) = 5),
    ville VARCHAR(50) NOT NULL CHECK (LENGTH(ville) >= 3),
    pays VARCHAR(50) NOT NULL CHECK (LENGTH(pays) >= 5),
    telephone VARCHAR(10),
    email VARCHAR(100) CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    site_web VARCHAR(100) CHECK (site_web ~ '^(https?://)?(www.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(/[^ ]*)?$'),
    added_by_sql BOOLEAN,
    date_creation_localisation DATE NOT NULL,
    date_modification_localisation DATE NOT NULL
);

CREATE TABLE EMPRUNT (
    id_emprunt SERIAL PRIMARY KEY,
    nom_emprunt VARCHAR(100) NOT NULL,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    id_voiture INT NOT NULL REFERENCES VOITURES(id_voiture),
    id_cle INT REFERENCES CLE(id_cle),
    statut_emprunt VARCHAR(50) NOT NULL,
    id_utilisateur_demande INT NOT NULL REFERENCES UTILISATEUR(id_user),
    description VARCHAR(500) NOT NULL,
    id_liste_passager INT REFERENCES LISTE_PASSAGER(id_liste_passager),
    id_localisation INT REFERENCES LOCALISATION(id_localisation),
    date_creation_emprunt DATE NOT NULL,
    date_modification_emprunt DATE NOT NULL
);

 

 
# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Création des entreprises
entreprise1 = Entreprise.create!(
  nom_entreprise: 'Tech Innov',
  raison_sociale: 'Tech Innovations SARL',
  forme_juridique: 'SARL',
  numero_siret: '12345678901234',
  adresse: '10 Rue des Entrepreneurs',
  code_postal: '75001',
  ville: 'Paris',
  pays: 'France',
  telephone: '0123456789',
  email: 'contact@techinnov.fr',
  site_web: 'https://www.techinnov.fr',
  secteur_activite: 'Technologie',
  effectif: 50,
  capital_social: 100000,
  lien_image_entreprise: 'https://www.techinnov.fr/logo.png',
  code_entreprise: 'TECH123',
)

entreprise2 = Entreprise.create!(
  nom_entreprise: 'Green Solutions',
  raison_sociale: 'Green Solutions SAS',
  forme_juridique: 'SAS',
  numero_siret: '98765432109876',
  adresse: '20 Avenue de lEcologie',
  code_postal: '13001',
  ville: 'Marseille',
  pays: 'France',
  telephone: '0987654321',
  email: 'contact@greensolutions.fr',
  site_web: 'https://www.greensolutions.fr',
  secteur_activite: 'Environnement',
  effectif: 120,
  capital_social: 500000,
  lien_image_entreprise: 'https://www.greensolutions.fr/logo.png',
  code_entreprise: 'GREEN123',
)

# Création des sites
site1 = Site.create!(
  nom_site: 'Site Paris',
  adresse: '10 Rue des Entrepreneurs',
  code_postal: '75001',
  ville: 'Paris',
  pays: 'France',
  telephone: '0123456789',
  email: 'contact@techinnov.fr',
  site_web: 'https://www.techinnov.fr',
  lien_image_site: 'https://www.techinnov.fr/site_paris.png',
  entreprise: entreprise1,
)

site2 = Site.create!(
  nom_site: 'Site Marseille',
  adresse: '20 Avenue de lEcologie',
  code_postal: '13001',
  ville: 'Marseille',
  pays: 'France',
  telephone: '0987654321',
  email: 'contact@greensolutions.fr',
  site_web: 'https://www.greensolutions.fr',
  lien_image_site: 'https://www.greensolutions.fr/site_marseille.png',
  entreprise: entreprise2,
)

# Création des utilisateurs
user1 = Utilisateur.create!(
  email: 'jean.dupont@techinnov.fr',
  password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  admin_entreprise: true,
  admin_rentecaisse: false,
  nom: 'Dupont',
  prenom: 'Jean',
  date_naissance: '1990-03-15',
  adresse: '15 Rue du Tech',
  code_postal: '75002',
  ville: 'Paris',
  pays: 'France',
  telephone: '0123456789',
  categorie_permis: 'B',
  lien_image_utilisateur: 'https://www.techinnov.fr/jean.png',
  entreprise: entreprise1,
  site: site1,
)

user2 = Utilisateur.create!(
  email: 'lucie.dupont@greensolutions.fr',
  password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  admin_entreprise: false,
  admin_rentecaisse: true,
  nom: 'Dupont',
  prenom: 'Lucie',
  date_naissance: '1985-07-30',
  adresse: '30 Avenue du Green',
  code_postal: '13002',
  ville: 'Marseille',
  pays: 'France',
  telephone: '0987654321',
  categorie_permis: 'B',
  lien_image_utilisateur: 'https://www.greensolutions.fr/lucie.png',
  entreprise: entreprise2,
  site: site2,
)

# Création des voitures
voiture1 = Voiture.create!(
  marque: 'Tesla',
  modele: 'Model 3',
  année_fabrication: 2023,
  immatriculation: 'AB123CD',
  carburant: 'Electrique',
  couleur: 'Noir',
  puissance: 350,
  nombre_portes: 4,
  nombre_places: 5,
  type_boite: 'Automatique',
  statut_voiture: 'DISPONIBLE',
  lien_image_voiture: 'https://www.techinnov.fr/tesla_model3.png',
  entreprise: entreprise1,
  site: site1,
)

voiture2 = Voiture.create!(
  marque: 'Renault',
  modele: 'Clio',
  année_fabrication: 2020,
  immatriculation: 'XY456ZT',
  carburant: 'Essence',
  couleur: 'Blanc',
  puissance: 90,
  nombre_portes: 5,
  nombre_places: 5,
  type_boite: 'Manuelle',
  statut_voiture: 'DISPONIBLE',
  lien_image_voiture: 'https://www.greensolutions.fr/renault_clio.png',
  entreprise: entreprise2,
  site: site2,
)

# Création des clés
cle1 = Cle.create!(
  statut_cle: 'DISPONIBLE',
  voiture: voiture1,
  utilisateur: user1,
  site: site1,
)

cle2 = Cle.create!(
  statut_cle: 'DISPONIBLE',
  voiture: voiture2,
  utilisateur: user2,
  site: site2,
)

# Création des listes de passagers
liste1 = ListePassager.create!(
  utilisateur: user1,
)

liste2 = ListePassager.create!(
  utilisateur: user2,
)

# Création des localisations
loc1 = Localisation.create!(
  nom_localisation: 'Localisation Paris',
  adresse: '10 Rue des Entrepreneurs',
  code_postal: '75001',
  ville: 'Paris',
  pays: 'France',
  telephone: '0123456789',
  email: 'contact@techinnov.fr',
  site_web: 'https://www.techinnov.fr',
  added_by_sql: true,
)

loc2 = Localisation.create!(
  nom_localisation: 'Localisation Marseille',
  adresse: '20 Avenue de lEcologie',
  code_postal: '13001',
  ville: 'Marseille',
  pays: 'France',
  telephone: '0987654321',
  email: 'contact@greensolutions.fr',
  site_web: 'https://www.greensolutions.fr',
  added_by_sql: true,
)

# Création des emprunts
Emprunt.create!(
  nom_emprunt: 'Emprunt voiture Tesla',
  date_debut: '2023-01-02 09:00:00',
  date_fin: '2023-01-02 18:00:00',
  voiture: voiture1,
  cle: cle1,
  statut_emprunt: 'EN COURS',
  utilisateur_demande: user1,
  description: 'Utilisation pour réunion externe',
  liste_passager: liste1,
  localisation: loc1,
)

Emprunt.create!(
  nom_emprunt: 'Emprunt voiture Clio',
  date_debut: '2020-06-16 09:00:00',
  date_fin: '2020-06-16 18:00:00',
  voiture: voiture2,
  cle: cle2,
  statut_emprunt: 'EN COURS',
  utilisateur_demande: user2,
  description: 'Mission pour client',
  liste_passager: liste2,
  localisation: loc2,
)

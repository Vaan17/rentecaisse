Entreprise.create(
  nom_entreprise: "Entreprise1",
  raison_sociale: "ENTREPRISE1",
  forme_juridique: "SAS",
  numero_siret: "12345678901234",
  adresse: "123 Rue de la Paix",
  code_postal: "75000",
  ville: "Paris",
  pays: "France",
  telephone: "0123456789",
  email: "entreprise1@gmail.com",
  site_web: "https://www.entreprise1.com",
  secteur_activite: "Informatique",
  effectif: 10,
  capital_social: 100000,
  lien_image_entreprise: nil,
  code_entreprise: "ENT1"
)

Entreprise.create(
  nom_entreprise: "Entreprise2",
  raison_sociale: "ENTREPRISE2",
  forme_juridique: "SARL",
  numero_siret: "12345678901235",
  adresse: "12 Rue du pain d'épice",
  code_postal: "17000",
  ville: "La Rochelle",
  pays: "France",
  telephone: "0234567890",
  email: "entreprise2@gmail.com",
  site_web: "https://www.entreprise2.com",
  secteur_activite: "Agroalimentaire",
  effectif: 56,
  capital_social: 50000,
  lien_image_entreprise: nil,
  code_entreprise: "ENT2"
)

Site(id: integer, nom_site: string, adresse: string, code_postal: string, ville: string, pays: string, telephone: string, email: string, site_web: string, lien_image_site: string, entreprise_id: integer)

Site.create(
  nom_site: "Site1",
  adresse: "111 Rue de la Paix",
  code_postal: "75000",
  ville: "Paris",
  pays: "France",
  telephone: "0234567890",
  email: "site1@gmail.com",
  site_web: "https://www.site1.com",
  lien_image_site: nil,
  entreprise_id: 2
)

Site.create(
  nom_site: "Site2",
  adresse: "12 Rue du pain d'épice",
  code_postal: "17000",
  ville: "La Rochelle",
  pays: "France",
  telephone: "0234567890",
  email: "site2@gmail.com",
  site_web: "https://www.site2.com",
  lien_image_site: nil,
  entreprise_id: 2
)

Site.create(
  nom_site: "Site3",
  adresse: "12 Rue du pain d'épice",
  code_postal: "17000",
  ville: "La Rochelle",
  pays: "France",
  telephone: "0234567890",
  email: "site3@gmail.com",
  site_web: "https://www.site3.com",
  lien_image_site: nil,
  entreprise_id: 3
)

Site.create(
  nom_site: "Site4",
  adresse: "12 Rue du pain d'épice",
  code_postal: "17000",
  ville: "La Rochelle",
  pays: "France",
  telephone: "0234567890",
  email: "site4@gmail.com",
  site_web: "https://www.site4.com",
  lien_image_site: nil,
  entreprise_id: 3
)
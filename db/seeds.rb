# ===================================================================
# RENTECAISSE - Script de Seeds
# ===================================================================
# Ce script génère un jeu de données complet et réaliste pour l'application
# Quantités générées :
# - 6 entreprises (secteurs variés)
# - 18 sites (répartition géographique)
# - 60 voitures (marques variées)
# - 120 clés (statuts variés)
# - 40 utilisateurs (rôles différents)
# - 25 localisations
# - 15 emprunts de démonstration
# ===================================================================

puts "🚀 Démarrage du script de seeds RenteCaisse..."
puts "=" * 60

# ===================================================================
# VARIABLES GLOBALES POUR LE SUIVI DES ERREURS
# ===================================================================

# Compteurs globaux
@total_errors = 0
@total_success = 0
@sections_with_errors = []

def add_error(section, count = 1)
  @total_errors += count
  @sections_with_errors << section unless @sections_with_errors.include?(section)
end

def add_success(count = 1)
  @total_success += count
end

# ===================================================================
# MÉTHODES HELPER
# ===================================================================

def generate_siret
  # Génère un SIRET valide (14 chiffres)
  base = rand(100_000_000..999_999_999).to_s
  complement = rand(10_000..99_999).to_s
  "#{base}#{complement}"
end

def generate_phone
  # Génère un numéro de téléphone français valide
  prefixes = ['01', '02', '03', '04', '05', '06', '07', '09']
  prefix = prefixes.sample
  number = 8.times.map { rand(0..9) }.join
  "#{prefix}#{number}"
end

def generate_email(prenom, nom, entreprise)
  # Génère un email professionnel
  domain = entreprise.downcase.gsub(/[^a-z0-9]/, '')
  "#{prenom.downcase}.#{nom.downcase}@#{domain}.fr"
end

def generate_immatriculation
  # Génère une plaque d'immatriculation française (format AA-123-BB)
  letters1 = 2.times.map { ('A'..'Z').to_a.sample }.join
  numbers = 3.times.map { rand(0..9) }.join
  letters2 = 2.times.map { ('A'..'Z').to_a.sample }.join
  "#{letters1}#{numbers}#{letters2}"
end

def log_progress(message, count = nil)
  if count
    puts "✅ #{message} (#{count} créé#{count > 1 ? 's' : ''})"
  else
    puts "📋 #{message}"
  end
end

def log_section(title)
  puts "\n" + "=" * 60
  puts "📦 #{title.upcase}"
  puts "=" * 60
end

# ===================================================================
# DONNÉES DE BASE
# ===================================================================

# Entreprises avec secteurs variés
ENTREPRISES_DATA = [
  {
    nom: 'TechInnovation',
    raison_sociale: 'TechInnovation SARL',
    forme_juridique: 'SARL',
    secteur: 'Technologie',
    ville: 'Paris',
    code_postal: '75001',
    adresse: '15 Rue de la Technologie',
    effectif: 85,
    capital: 250000
  },
  {
    nom: 'GreenSolutions',
    raison_sociale: 'Green Solutions SAS',
    forme_juridique: 'SAS',
    secteur: 'Environnement',
    ville: 'Lyon',
    code_postal: '69001',
    adresse: '42 Avenue de l\'Écologie',
    effectif: 120,
    capital: 500000
  },
  {
    nom: 'MediCare Plus',
    raison_sociale: 'MediCare Plus SA',
    forme_juridique: 'SA',
    secteur: 'Santé',
    ville: 'Marseille',
    code_postal: '13001',
    adresse: '8 Boulevard de la Santé',
    effectif: 200,
    capital: 1000000
  },
  {
    nom: 'LogiTransport',
    raison_sociale: 'LogiTransport EURL',
    forme_juridique: 'EURL',
    secteur: 'Transport',
    ville: 'Toulouse',
    code_postal: '31000',
    adresse: '25 Route du Transport',
    effectif: 150,
    capital: 300000
  },
  {
    nom: 'ConseilPro',
    raison_sociale: 'ConseilPro SCS',
    forme_juridique: 'SCS',
    secteur: 'Conseil',
    ville: 'Nantes',
    code_postal: '44000',
    adresse: '12 Place du Conseil',
    effectif: 45,
    capital: 150000
  },
  {
    nom: 'BuildTech',
    raison_sociale: 'BuildTech SNC',
    forme_juridique: 'SNC',
    secteur: 'Construction',
    ville: 'Lille',
    code_postal: '59000',
    adresse: '33 Rue de la Construction',
    effectif: 90,
    capital: 400000
  }
].freeze

# Villes françaises pour les sites
VILLES_SITES = [
  { nom: 'Paris', code_postal: '75001' },
  { nom: 'Lyon', code_postal: '69001' },
  { nom: 'Marseille', code_postal: '13001' },
  { nom: 'Toulouse', code_postal: '31000' },
  { nom: 'Nice', code_postal: '06000' },
  { nom: 'Nantes', code_postal: '44000' },
  { nom: 'Strasbourg', code_postal: '67000' },
  { nom: 'Montpellier', code_postal: '34000' },
  { nom: 'Bordeaux', code_postal: '33000' },
  { nom: 'Lille', code_postal: '59000' },
  { nom: 'Rennes', code_postal: '35000' },
  { nom: 'Reims', code_postal: '51100' },
  { nom: 'Le Havre', code_postal: '76600' },
  { nom: 'Saint-Étienne', code_postal: '42000' },
  { nom: 'Toulon', code_postal: '83000' }
].freeze

# Marques et modèles de voitures
VOITURES_DATA = [
  { marque: 'Renault', modeles: ['Clio', 'Megane', 'Scenic', 'Captur', 'Kadjar'] },
  { marque: 'Peugeot', modeles: ['208', '308', '3008', '5008', 'Partner'] },
  { marque: 'Citroën', modeles: ['C3', 'C4', 'C5 Aircross', 'Berlingo', 'Jumpy'] },
  { marque: 'Volkswagen', modeles: ['Golf', 'Polo', 'Tiguan', 'Passat', 'Caddy'] },
  { marque: 'Ford', modeles: ['Fiesta', 'Focus', 'Kuga', 'Mondeo', 'Transit'] },
  { marque: 'Toyota', modeles: ['Yaris', 'Corolla', 'RAV4', 'Prius', 'Proace'] },
  { marque: 'BMW', modeles: ['Serie 1', 'Serie 3', 'X1', 'X3', 'Serie 2'] },
  { marque: 'Mercedes', modeles: ['Classe A', 'Classe C', 'GLA', 'GLC', 'Vito'] },
  { marque: 'Audi', modeles: ['A3', 'A4', 'Q3', 'Q5', 'A6'] },
  { marque: 'Tesla', modeles: ['Model 3', 'Model Y', 'Model S', 'Model X'] }
].freeze

# Types de carburant
CARBURANTS = ['Diesel', 'Essence', 'Ethanol', 'Electrique', 'Autre'].freeze

# Couleurs de voitures
COULEURS = ['Blanc', 'Noir', 'Gris', 'Rouge', 'Bleu', 'Vert', 'Argent', 'Orange'].freeze

# Types de boîte
TYPES_BOITE = ['Manuelle', 'Automatique'].freeze

# Statuts des voitures
STATUTS_VOITURE = ['Fonctionnelle', 'Non fonctionnelle', 'En réparation'].freeze

# Statuts des clés
STATUTS_CLE = ['Primaire', 'Double'].freeze

# Prénoms et noms français
PRENOMS = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Julie', 'Paul', 'Emma', 'Louis', 'Sarah', 
           'Michel', 'Claire', 'David', 'Laura', 'Thomas', 'Camille', 'Nicolas', 'Léa', 'Philippe', 'Manon'].freeze

NOMS = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
        'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard'].freeze

# Catégories de permis
CATEGORIES_PERMIS = ['B Manuel', 'B Automatique'].freeze

# Genres
GENRES = ['masculin', 'feminin', 'autre'].freeze

# ===================================================================
# NETTOYAGE OPTIONNEL
# ===================================================================

log_section "Nettoyage optionnel de la base de données"

if Rails.env.development?
  print "🗑️  Voulez-vous nettoyer la base de données avant le seed ? (y/N): "
  response = STDIN.gets.chomp.downcase
  
  if response == 'y' || response == 'yes'
    log_progress "Nettoyage de la base de données en cours..."
    
    begin
      Emprunt.destroy_all
      ListePassagerUtilisateur.destroy_all
      ListePassager.destroy_all
      Localisation.destroy_all
      Cle.destroy_all
      Voiture.destroy_all
      Utilisateur.destroy_all
      Site.destroy_all
      Entreprise.destroy_all
      
      log_progress "Base de données nettoyée avec succès"
    rescue => e
      puts "❌ Erreur lors du nettoyage : #{e.message}"
    end
  else
    log_progress "Conservation des données existantes"
  end
end

# ===================================================================
# CRÉATION DES ENTREPRISES
# ===================================================================

log_section "Création des entreprises"

entreprises = []

ENTREPRISES_DATA.each_with_index do |data, index|
  begin
    # Générer un SIRET unique
    siret = generate_siret
    tentatives = 0
    while Entreprise.exists?(numero_siret: siret) && tentatives < 10
      siret = generate_siret
      tentatives += 1
    end
    
    if tentatives >= 10
      add_error("Entreprises")
      puts "❌ ERREUR: Impossible de générer un SIRET unique pour #{data[:nom]} après 10 tentatives"
      next
    end
    
    entreprise = Entreprise.find_or_create_by(numero_siret: siret) do |e|
      e.nom_entreprise = data[:nom]
      e.raison_sociale = data[:raison_sociale]
      e.forme_juridique = data[:forme_juridique]
      e.adresse = data[:adresse]
      e.code_postal = data[:code_postal]
      e.ville = data[:ville]
      e.pays = 'France'
      e.telephone = generate_phone
      e.email = "contact@#{data[:nom].downcase.gsub(/[^a-z0-9]/, '')}.fr"
      e.site_web = "https://www.#{data[:nom].downcase.gsub(/[^a-z0-9]/, '')}.fr"
      e.secteur_activite = data[:secteur]
      e.effectif = data[:effectif]
      e.capital_social = data[:capital]
      e.code_entreprise = "#{data[:nom].upcase[0..3]}#{rand(100..999)}"
    end
    
    # Validation de l'entreprise créée
    if entreprise.persisted? && entreprise.valid?
      entreprises << entreprise
      add_success
      log_progress "Entreprise créée : #{entreprise.nom_entreprise}"
    else
      add_error("Entreprises")
      puts "❌ ERREUR: Échec de création/validation de l'entreprise #{data[:nom]}"
      puts "   Persisted: #{entreprise.persisted?}, Valid: #{entreprise.valid?}"
      if entreprise.errors.any?
        puts "   Erreurs de validation: #{entreprise.errors.full_messages.join(', ')}"
      end
    end
    
  rescue => e
    add_error("Entreprises")
    puts "❌ ERREUR lors de la création de l'entreprise #{data[:nom]} : #{e.message}"
  end
end

log_progress "Entreprises créées", entreprises.length

# ===================================================================
# CRÉATION DES SITES
# ===================================================================

log_section "Création des sites"

sites = []

entreprises.each do |entreprise|
  # Chaque entreprise a 3 sites
  3.times do |i|
    ville_data = VILLES_SITES.sample
    
    begin
      # Créer un nom de site unique pour éviter les doublons
      nom_site_unique = "Site #{ville_data[:nom]} - #{entreprise.nom_entreprise} ##{i+1}"
      
      # Nettoyer le nom de la ville pour l'email et l'URL (retirer espaces et caractères spéciaux)
      ville_clean = ville_data[:nom].downcase.gsub(/[^a-z0-9]/, '')
      entreprise_clean = entreprise.nom_entreprise.downcase.gsub(/[^a-z0-9]/, '')
      
      site = Site.find_or_create_by(
        nom_site: nom_site_unique,
        entreprise: entreprise,
        ville: ville_data[:nom]  # Ajouter pour éviter les doublons
      ) do |s|
        s.adresse = "#{rand(1..999)} #{['Rue', 'Avenue', 'Boulevard'].sample} #{['de la Paix', 'du Commerce', 'des Entrepreneurs', 'de l\'Innovation'].sample}"
        s.code_postal = ville_data[:code_postal]
        s.pays = 'France'
        s.telephone = generate_phone
        s.email = "site#{i+1}.#{ville_clean}@#{entreprise_clean}.fr"
        s.site_web = "https://www.#{entreprise_clean}.fr/#{ville_clean}/site#{i+1}"
      end
      
      # VALIDATION CRITIQUE : Vérifier que le site est vraiment sauvegardé et valide
      if site.persisted? && site.valid?
        sites << site
        add_success
        log_progress "Site créé : #{site.nom_site}"
      else
        add_error("Sites")
        puts "❌ ERREUR: Échec de création/validation du site #{ville_data[:nom]}"
        puts "   Nom du site: #{nom_site_unique}"
        puts "   Persisted: #{site.persisted?}, Valid: #{site.valid?}"
        if site.errors.any?
          puts "   Erreurs de validation: #{site.errors.full_messages.join(', ')}"
        end
      end
      
    rescue => e
      add_error("Sites")
      puts "❌ ERREUR lors de la création du site #{ville_data[:nom]} : #{e.message}"
      puts "   Entreprise: #{entreprise.nom_entreprise}"
    end
  end
end

log_progress "Sites créés", sites.length

# ===================================================================
# CRÉATION DE L'ENTREPRISE ET DU SITE POUR L'ADMIN RENTECAISSE
# ===================================================================

log_section "Création de l'entreprise et du site RenteCaisse"

entreprise_rentecaisse = nil
site_rentecaisse = nil

begin
  # Créer l'entreprise RenteCaisse
  siret_rentecaisse = generate_siret
  tentatives = 0
  while Entreprise.exists?(numero_siret: siret_rentecaisse) && tentatives < 10
    siret_rentecaisse = generate_siret
    tentatives += 1
  end
  
  if tentatives >= 10
    add_error("Entreprise RenteCaisse")
    puts "❌ ERREUR: Impossible de générer un SIRET unique pour RenteCaisse après 10 tentatives"
  else
    entreprise_rentecaisse = Entreprise.find_or_create_by(numero_siret: siret_rentecaisse) do |e|
      e.nom_entreprise = 'RenteCaisse'
      e.raison_sociale = 'RenteCaisse SAS'
      e.forme_juridique = 'SAS'
      e.adresse = '1 Avenue de la Gestion de Flotte'
      e.code_postal = '75001'
      e.ville = 'Paris'
      e.pays = 'France'
      e.telephone = generate_phone
      e.email = 'contact@rentecaisse.fr'
      e.site_web = 'https://www.rentecaisse.fr'
      e.secteur_activite = 'Technologie'
      e.effectif = 10
      e.capital_social = 100000
      e.code_entreprise = 'RENT001'
    end
    
    if entreprise_rentecaisse.persisted? && entreprise_rentecaisse.valid?
      add_success
      log_progress "Entreprise RenteCaisse créée : #{entreprise_rentecaisse.nom_entreprise}"
      
      # Créer le site siège RenteCaisse
      site_rentecaisse = Site.find_or_create_by(
        nom_site: "Siège RenteCaisse",
        entreprise: entreprise_rentecaisse,
        ville: "Paris"
      ) do |s|
        s.adresse = "1 Avenue de la Gestion de Flotte"
        s.code_postal = "75001"
        s.pays = 'France'
        s.telephone = generate_phone
        s.email = "siege@rentecaisse.fr"
        s.site_web = "https://www.rentecaisse.fr/siege"
      end
      
      if site_rentecaisse.persisted? && site_rentecaisse.valid?
        add_success
        log_progress "Site siège RenteCaisse créé : #{site_rentecaisse.nom_site}"
      else
        add_error("Site RenteCaisse")
        puts "❌ ERREUR: Échec de création/validation du site RenteCaisse"
        puts "   Persisted: #{site_rentecaisse.persisted?}, Valid: #{site_rentecaisse.valid?}"
        if site_rentecaisse.errors.any?
          puts "   Erreurs de validation: #{site_rentecaisse.errors.full_messages.join(', ')}"
        end
      end
      
    else
      add_error("Entreprise RenteCaisse")
      puts "❌ ERREUR: Échec de création/validation de l'entreprise RenteCaisse"
      puts "   Persisted: #{entreprise_rentecaisse.persisted?}, Valid: #{entreprise_rentecaisse.valid?}"
      if entreprise_rentecaisse.errors.any?
        puts "   Erreurs de validation: #{entreprise_rentecaisse.errors.full_messages.join(', ')}"
      end
    end
  end
  
rescue => e
  add_error("Entreprise RenteCaisse")
  puts "❌ ERREUR lors de la création de l'entreprise/site RenteCaisse : #{e.message}"
end

# ===================================================================
# CRÉATION DES UTILISATEURS
# ===================================================================

log_section "Création des utilisateurs"

utilisateurs = []
password_hash = Digest::SHA256.hexdigest('password123')

# Créer un admin RenteCaisse
begin
  admin_rentecaisse = Utilisateur.find_or_create_by(email: 'admin@rentecaisse.fr') do |u|
    u.password = password_hash
    u.admin_entreprise = true   # L'admin est aussi admin de son entreprise
    u.admin_rentecaisse = true
    u.nom = 'Admin'
    u.prenom = 'RenteCaisse'
    u.date_naissance = '1985-01-01'
    u.genre = 'autre'
    u.adresse = '1 Avenue de la Gestion de Flotte'
    u.code_postal = '75001'
    u.ville = 'Paris'
    u.pays = 'France'
    u.telephone = generate_phone
    u.categorie_permis = CATEGORIES_PERMIS.sample
    u.email_confirme = true
    u.premiere_connexion = false
    u.confirmation_entreprise = true
    # Assigner l'entreprise et le site RenteCaisse si ils existent
    u.entreprise_id = entreprise_rentecaisse&.id
    u.site_id = site_rentecaisse&.id
  end
  
  # Si l'admin existait déjà, s'assurer qu'il a bien l'entreprise et le site RenteCaisse
  if admin_rentecaisse.persisted? && !admin_rentecaisse.changed? && entreprise_rentecaisse && site_rentecaisse
    updated = false
    if admin_rentecaisse.entreprise_id != entreprise_rentecaisse.id
      admin_rentecaisse.entreprise_id = entreprise_rentecaisse.id
      updated = true
    end
    if admin_rentecaisse.site_id != site_rentecaisse.id
      admin_rentecaisse.site_id = site_rentecaisse.id
      updated = true
    end
    if !admin_rentecaisse.admin_entreprise
      admin_rentecaisse.admin_entreprise = true
      updated = true
    end
    
    if updated
      admin_rentecaisse.save!
      log_progress "🔄 Admin RenteCaisse mis à jour avec entreprise et site"
    end
  end
  
  # Validation de l'admin créé
  if admin_rentecaisse.persisted? && admin_rentecaisse.valid?
    utilisateurs << admin_rentecaisse
    add_success
    if entreprise_rentecaisse && site_rentecaisse
      log_progress "Admin RenteCaisse créé : #{admin_rentecaisse.email} - Entreprise: #{entreprise_rentecaisse.nom_entreprise}, Site: #{site_rentecaisse.nom_site}"
    else
      log_progress "Admin RenteCaisse créé : #{admin_rentecaisse.email} (sans entreprise/site)"
    end
  else
    add_error("Utilisateurs")
    puts "❌ ERREUR: Échec de création/validation de l'admin RenteCaisse"
    puts "   Email: admin@rentecaisse.fr"
    puts "   Persisted: #{admin_rentecaisse.persisted?}, Valid: #{admin_rentecaisse.valid?}"
    if admin_rentecaisse.errors.any?
      puts "   Erreurs de validation: #{admin_rentecaisse.errors.full_messages.join(', ')}"
    end
  end
  
rescue => e
  add_error("Utilisateurs")
  puts "❌ ERREUR lors de la création de l'admin RenteCaisse : #{e.message}"
end

# Créer des utilisateurs pour chaque site
sites.each do |site|
  # 2-3 utilisateurs par site
  rand(2..3).times do |i|
    prenom = PRENOMS.sample
    nom = NOMS.sample
    
    begin
      email = generate_email(prenom, nom, site.entreprise.nom_entreprise)
      
      utilisateur = Utilisateur.find_or_create_by(email: email) do |u|
        u.password = password_hash
        u.admin_entreprise = (i == 0) # Le premier utilisateur de chaque site est admin entreprise
        u.admin_rentecaisse = false
        u.nom = nom
        u.prenom = prenom
        u.date_naissance = Date.new(rand(1970..2000), rand(1..12), rand(1..28))
        u.genre = GENRES.sample
        u.adresse = "#{rand(1..999)} #{['Rue', 'Avenue', 'Boulevard'].sample} #{['des Fleurs', 'de la Paix', 'du Commerce'].sample}"
        u.code_postal = site.code_postal
        u.ville = site.ville
        u.pays = 'France'
        u.telephone = generate_phone
        u.categorie_permis = CATEGORIES_PERMIS.sample
        u.email_confirme = true
        u.premiere_connexion = false
        u.entreprise_id = site.entreprise.id  # Assignation explicite de l'entreprise
        u.site_id = site.id                   # Assignation explicite du site
        u.confirmation_entreprise = true      # Confirmation d'entreprise activée
      end
      
      # Si l'utilisateur existait déjà, s'assurer qu'il a bien une entreprise et un site
      if utilisateur.persisted? && !utilisateur.changed?
        # L'utilisateur existait déjà, mettre à jour entreprise et site si nécessaires
        updated = false
        if utilisateur.entreprise_id.nil? || utilisateur.entreprise_id != site.entreprise.id
          utilisateur.entreprise_id = site.entreprise.id
          updated = true
        end
        if utilisateur.site_id.nil? || utilisateur.site_id != site.id
          utilisateur.site_id = site.id
          updated = true
        end
        if !utilisateur.confirmation_entreprise
          utilisateur.confirmation_entreprise = true
          updated = true
        end
        
        if updated
          utilisateur.save!
          log_progress "🔄 Utilisateur mis à jour avec entreprise et site : #{utilisateur.prenom} #{utilisateur.nom}"
        end
      end
      
      # Validation de l'utilisateur créé
      if utilisateur.persisted? && utilisateur.valid?
        utilisateurs << utilisateur
        add_success
        log_progress "Utilisateur créé : #{utilisateur.prenom} #{utilisateur.nom} (#{utilisateur.email}) - Entreprise: #{site.entreprise.nom_entreprise}, Site: #{site.nom_site}"
      else
        add_error("Utilisateurs")
        puts "❌ ERREUR: Échec de création/validation de l'utilisateur #{prenom} #{nom}"
        puts "   Email: #{email}"
        puts "   Persisted: #{utilisateur.persisted?}, Valid: #{utilisateur.valid?}"
        if utilisateur.errors.any?
          puts "   Erreurs de validation: #{utilisateur.errors.full_messages.join(', ')}"
        end
      end
      
    rescue => e
      add_error("Utilisateurs")
      puts "❌ ERREUR lors de la création de l'utilisateur #{prenom} #{nom} : #{e.message}"
      puts "   Site: #{site.nom_site}"
    end
  end
end

log_progress "Utilisateurs créés", utilisateurs.length

# ===================================================================
# CRÉATION DES VOITURES
# ===================================================================

log_section "Création des voitures"

voitures = []
voitures_success = 0
voitures_errors = 0

sites.each_with_index do |site, site_index|
  # Validation du site avant de continuer
  puts "🔍 Traitement du site #{site_index + 1}/#{sites.length}: #{site&.nom_site}"
  
  if site.nil?
    puts "❌ ERREUR: Site nil détecté à l'index #{site_index}"
    voitures_errors += 1
    add_error("Voitures")
    next
  end
  
  # Vérifier que le site a bien un ID (donc qu'il est sauvegardé)
  if site.id.nil?
    puts "❌ ERREUR: Site '#{site.nom_site}' non sauvegardé (ID manquant)"
    puts "   Le site n'a pas été correctement créé en base de données"
    voitures_errors += 1
    add_error("Voitures")
    next
  end
  
  # Vérifier l'existence en base (redondant mais sûr)
  unless Site.exists?(site.id)
    puts "❌ ERREUR: Site ID #{site.id} n'existe pas en base de données"
    puts "   Site: #{site.nom_site}"
    voitures_errors += 1
    add_error("Voitures")
    next
  end
  
  # Vérifier que l'entreprise du site existe
  if site.entreprise.nil?
    puts "❌ ERREUR: Site #{site.nom_site} n'a pas d'entreprise associée"
    voitures_errors += 1
    add_error("Voitures")
    next
  end
  
  # 3-4 voitures par site
  nombre_voitures = rand(3..4)
  puts "📋 Création de #{nombre_voitures} voitures pour le site #{site.nom_site}"
  
  nombre_voitures.times do |i|
    voiture_data = VOITURES_DATA.sample
    modele = voiture_data[:modeles].sample
    
    begin
      # Générer une immatriculation unique avec limite de tentatives
      immatriculation = generate_immatriculation
      tentatives = 0
      while Voiture.exists?(immatriculation: immatriculation) && tentatives < 50
        immatriculation = generate_immatriculation
        tentatives += 1
      end
      
      if tentatives >= 50
        puts "❌ ERREUR: Impossible de générer une immatriculation unique après 50 tentatives"
        voitures_errors += 1
        next
      end
      
      # Validation des données avant création
      if site.entreprise_id.nil?
        puts "❌ ERREUR: entreprise_id est nil pour le site #{site.nom_site}"
        voitures_errors += 1
        next
      end
      
      voiture = Voiture.create!(
        immatriculation: immatriculation,
        marque: voiture_data[:marque],
        modele: modele,
        année_fabrication: rand(2018..2024),
        carburant: CARBURANTS.sample,
        couleur: COULEURS.sample,
        puissance: rand(75..300),
        nombre_portes: [3, 4, 5].sample,
        nombre_places: rand(2..7),
        type_boite: TYPES_BOITE.sample,
        statut_voiture: STATUTS_VOITURE.sample,
        entreprise_id: site.entreprise_id,  # Plus explicite
        site_id: site.id                    # Plus explicite
      )
      
      voitures << voiture
      voitures_success += 1
      add_success
      log_progress "Voiture créée : #{voiture.marque} #{voiture.modele} (#{voiture.immatriculation})"
      
    rescue => e
      voitures_errors += 1
      add_error("Voitures")
      puts "❌ ERREUR lors de la création de la voiture #{voiture_data[:marque]} #{modele} : #{e.message}"
      puts "   Site: #{site.nom_site} (ID: #{site.id})"
      puts "   Entreprise: #{site.entreprise&.nom_entreprise} (ID: #{site.entreprise_id})"
    end
  end
end

puts "📊 RÉSULTATS CRÉATION VOITURES:"
puts "   ✅ Succès: #{voitures_success}"
puts "   ❌ Erreurs: #{voitures_errors}" if voitures_errors > 0
puts "   📊 Total: #{voitures_success + voitures_errors}"

# ===================================================================
# CRÉATION DES CLÉS
# ===================================================================

log_section "Création des clés"

cles = []

voitures.each do |voiture|
  # 2 clés par voiture (primaire et double)
  2.times do |i|
    begin
      cle = Cle.find_or_create_by(
        voiture: voiture,
        statut_cle: (i == 0 ? 'Primaire' : 'Double')
      ) do |c|
        c.site = voiture.site
        # Assigner parfois une clé à un utilisateur du même site
        if rand < 0.3 # 30% de chance d'être assignée
          utilisateurs_site = utilisateurs.select { |u| u.site == voiture.site }
          c.utilisateur = utilisateurs_site.sample if utilisateurs_site.any?
        end
      end
      
      # Validation de la clé créée
      if cle.persisted? && cle.valid?
        cles << cle
        add_success
        log_progress "Clé créée pour #{voiture.marque} #{voiture.modele} (Statut: #{cle.statut_cle})"
      else
        add_error("Clés")
        puts "❌ ERREUR: Échec de création/validation de la clé pour #{voiture.marque} #{voiture.modele}"
        puts "   Statut: #{i == 0 ? 'Primaire' : 'Double'}"
        puts "   Persisted: #{cle.persisted?}, Valid: #{cle.valid?}"
        if cle.errors.any?
          puts "   Erreurs de validation: #{cle.errors.full_messages.join(', ')}"
        end
      end
      
    rescue => e
      add_error("Clés")
      puts "❌ ERREUR lors de la création de la clé pour #{voiture.marque} #{voiture.modele} : #{e.message}"
    end
  end
end

log_progress "Clés créées", cles.length

# ===================================================================
# CRÉATION DES LOCALISATIONS
# ===================================================================

log_section "Création des localisations"

localisations = []

# Localisations variées
localisations_data = [
  { nom: 'Aéroport Charles de Gaulle', ville: 'Roissy-en-France', code_postal: '95700' },
  { nom: 'Gare de Lyon', ville: 'Paris', code_postal: '75012' },
  { nom: 'Centre Commercial Part-Dieu', ville: 'Lyon', code_postal: '69003' },
  { nom: 'Port de Marseille', ville: 'Marseille', code_postal: '13002' },
  { nom: 'Aéroport de Nice Côte d\'Azur', ville: 'Nice', code_postal: '06206' },
  { nom: 'Gare de Toulouse Matabiau', ville: 'Toulouse', code_postal: '31000' },
  { nom: 'Centre Hospitalier de Nantes', ville: 'Nantes', code_postal: '44093' },
  { nom: 'Université de Strasbourg', ville: 'Strasbourg', code_postal: '67000' },
  { nom: 'Palais des Congrès de Montpellier', ville: 'Montpellier', code_postal: '34000' },
  { nom: 'Port de Bordeaux', ville: 'Bordeaux', code_postal: '33300' },
  { nom: 'Gare de Lille Europe', ville: 'Lille', code_postal: '59777' },
  { nom: 'Centre Commercial Alma', ville: 'Rennes', code_postal: '35000' },
  { nom: 'Cathédrale de Reims', ville: 'Reims', code_postal: '51100' },
  { nom: 'Port du Havre', ville: 'Le Havre', code_postal: '76600' },
  { nom: 'Stade Geoffroy-Guichard', ville: 'Saint-Étienne', code_postal: '42000' },
  { nom: 'Base Navale de Toulon', ville: 'Toulon', code_postal: '83000' },
  { nom: 'Centre d\'Affaires La Défense', ville: 'Puteaux', code_postal: '92800' },
  { nom: 'Parc des Expositions Eurexpo', ville: 'Chassieu', code_postal: '69680' },
  { nom: 'Technopôle Sophia Antipolis', ville: 'Valbonne', code_postal: '06560' },
  { nom: 'Zone Industrielle de Rungis', ville: 'Rungis', code_postal: '94150' },
  { nom: 'Centre de Recherche INRIA', ville: 'Rocquencourt', code_postal: '78153' },
  { nom: 'Campus Universitaire de Villetaneuse', ville: 'Villetaneuse', code_postal: '93430' },
  { nom: 'Hôpital Européen Marseille', ville: 'Marseille', code_postal: '13003' },
  { nom: 'Centre Commercial Beaulieu', ville: 'Nantes', code_postal: '44200' },
  { nom: 'Parc Technologique du Canal', ville: 'Toulouse', code_postal: '31520' }
]

localisations_data.each do |data|
  begin
    localisation = Localisation.find_or_create_by(
      nom_localisation: data[:nom],
      ville: data[:ville]
    ) do |l|
      l.adresse = "#{rand(1..999)} #{['Rue', 'Avenue', 'Boulevard'].sample} #{['Principal', 'Central', 'de l\'Entrée'].sample}"
      l.code_postal = data[:code_postal]
      l.pays = 'France'
      l.telephone = generate_phone
      l.email = "contact@#{data[:nom].downcase.gsub(/[^a-z0-9]/, '').gsub(' ', '')}.fr"
      l.site_web = "https://www.#{data[:nom].downcase.gsub(/[^a-z0-9]/, '').gsub(' ', '')}.fr"
      l.added_by_sql = true
    end
    
    # Validation de la localisation créée
    if localisation.persisted? && localisation.valid?
      localisations << localisation
      add_success
      log_progress "Localisation créée : #{localisation.nom_localisation}"
    else
      add_error("Localisations")
      puts "❌ ERREUR: Échec de création/validation de la localisation #{data[:nom]}"
      puts "   Persisted: #{localisation.persisted?}, Valid: #{localisation.valid?}"
      if localisation.errors.any?
        puts "   Erreurs de validation: #{localisation.errors.full_messages.join(', ')}"
      end
    end
    
  rescue => e
    add_error("Localisations")
    puts "❌ ERREUR lors de la création de la localisation #{data[:nom]} : #{e.message}"
  end
end

log_progress "Localisations créées", localisations.length

# ===================================================================
# CRÉATION DES EMPRUNTS DE DÉMONSTRATION
# ===================================================================

log_section "Création des emprunts de démonstration"

emprunts = []

# Créer quelques emprunts pour la démonstration
15.times do |i|
  voiture = voitures.sample
  next unless voiture
  
  # Trouver une clé primaire pour cette voiture
  cle_disponible = cles.find { |c| c.voiture == voiture && c.statut_cle == 'Primaire' }
  next unless cle_disponible
  
  # Trouver un utilisateur du même site
  utilisateur = utilisateurs.find { |u| u.site == voiture.site }
  next unless utilisateur
  
  # Dates aléatoires (passées, présentes ou futures)
  date_debut = rand(30.days.ago..30.days.from_now)
  date_fin = date_debut + rand(2.hours..2.days)
  
  begin
    # Créer une liste de passagers
    liste_passager = ListePassager.create!
    
    emprunt = Emprunt.find_or_create_by(
      nom_emprunt: "Mission #{['Commerciale', 'Technique', 'Administrative', 'Urgente'].sample} ##{i+1}",
      voiture: voiture,
      utilisateur_demande: utilisateur
    ) do |e|
      e.date_debut = date_debut
      e.date_fin = date_fin
      e.cle = cle_disponible
      e.statut_emprunt = ['Planifié', 'En cours', 'Terminé', 'Annulé'].sample
      e.description = [
        'Déplacement pour réunion client',
        'Mission de maintenance sur site',
        'Transport de matériel',
        'Visite commerciale',
        'Formation externe',
        'Livraison urgente'
      ].sample
      e.liste_passager = liste_passager
      e.localisation = localisations.sample
    end
    
    # Ajouter quelques passagers aléatoirement
    if rand < 0.6 # 60% de chance d'avoir des passagers
      passagers_potentiels = utilisateurs.select { |u| u.site == voiture.site && u != utilisateur }
      rand(1..3).times do
        passager = passagers_potentiels.sample
        if passager
          begin
            ListePassagerUtilisateur.find_or_create_by(
              liste_passager: liste_passager,
              utilisateur: passager
            )
          rescue => e
            # Ignorer les erreurs de doublons
          end
        end
      end
    end
    
    emprunts << emprunt
    add_success
    log_progress "Emprunt créé : #{emprunt.nom_emprunt} (#{emprunt.voiture.marque} #{emprunt.voiture.modele})"
    
  rescue => e
    add_error("Emprunts")
    puts "❌ Erreur lors de la création de l'emprunt : #{e.message}"
  end
end

log_progress "Emprunts créés", emprunts.length

# ===================================================================
# RÉSUMÉ FINAL
# ===================================================================

log_section "Résumé de la génération des données"

# Déterminer le statut global
if @total_errors > 0
  puts "⚠️  Script de seeds terminé avec des erreurs !"
  puts "❌ Erreurs détectées dans : #{@sections_with_errors.join(', ')}"
else
  puts "🎉 Script de seeds terminé avec succès !"
end

puts ""
puts "📊 RÉSUMÉ DES DONNÉES CRÉÉES :"
puts "=" * 40
puts "🏢 Entreprises      : #{entreprises.length}"
puts "🏭 Sites            : #{sites.length}"
puts "👥 Utilisateurs     : #{utilisateurs.length}"
puts "🚗 Voitures         : #{voitures.length}"
puts "🔑 Clés             : #{cles.length}"
puts "📍 Localisations    : #{localisations.length}"
puts "📋 Emprunts         : #{emprunts.length}"
puts "=" * 40

# Affichage des statistiques d'erreurs
if @total_errors > 0
  puts ""
  puts "⚠️  STATISTIQUES D'ERREURS :"
  puts "=" * 40
  puts "❌ Total erreurs    : #{@total_errors}"
  puts "✅ Total succès     : #{@total_success}"
  puts "📊 Taux de succès   : #{(@total_success.to_f / (@total_success + @total_errors) * 100).round(1)}%"
  puts "=" * 40
end

puts ""
puts "🔐 COMPTES DE TEST :"
puts "Admin RenteCaisse : admin@rentecaisse.fr"
puts "Mot de passe      : password123"
puts ""
puts "Autres utilisateurs : [prenom].[nom]@[entreprise].fr"
puts "Mot de passe        : password123"

if @total_errors == 0
  puts ""
  puts "✅ Toutes les données ont été générées avec succès !"
  puts "🚀 Vous pouvez maintenant utiliser l'application RenteCaisse."
else
  puts ""
  puts "⚠️  Le script s'est terminé avec des erreurs."
  puts "📋 Veuillez vérifier les messages d'erreur ci-dessus."
  puts "🔧 Certaines fonctionnalités peuvent ne pas fonctionner correctement."
end

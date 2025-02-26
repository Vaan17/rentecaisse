class InitialMigration < ActiveRecord::Migration[7.1]
  def up
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :entreprises do |t|
      t.string :nom_entreprise, null: false
      t.string :raison_sociale
      t.string :forme_juridique, null: false
      t.string :numero_siret, null: false
      t.string :adresse, null: false
      t.string :code_postal, null: false
      t.string :ville, null: false
      t.string :pays, null: false
      t.string :telephone, null: false
      t.string :email, null: false
      t.string :site_web, null: false
      t.string :secteur_activite, null: false
      t.integer :effectif, null: false
      t.integer :capital_social, null: false
      t.string :lien_image_entreprise
      t.string :code_entreprise, null: false
      t.date :date_creation_entreprise, null: false
      t.date :date_modification_entreprise, null: false

      t.timestamps
    end

    add_index :entreprises, :numero_siret, unique: true

    create_table :sites do |t|
      t.string :nom_site, null: false
      t.string :adresse, null: false
      t.string :code_postal, null: false
      t.string :ville, null: false
      t.string :pays, null: false
      t.string :telephone, null: false
      t.string :email, null: false
      t.string :site_web, null: false
      t.string :lien_image_site
      t.references :entreprise, null: false, foreign_key: true
      t.date :date_creation_site, null: false
      t.date :date_modification_site, null: false

      t.timestamps
    end

    create_table :utilisateurs do |t|
      t.string :email, null: false
      t.string :password, null: false
      t.boolean :admin_entreprise, null: false, default: false
      t.boolean :admin_rentecaisse, null: false, default: false
      t.string :nom
      t.string :prenom
      t.date :date_naissance
      t.string :genre
      t.string :adresse
      t.string :code_postal
      t.string :ville
      t.string :pays
      t.string :telephone
      t.string :categorie_permis
      t.string :lien_image_utilisateur
      t.boolean :email_confirme, null: false, default: false
      t.string :confirmation_token
      t.boolean :premiere_connexion, null: false, default: true
      t.references :entreprise, foreign_key: true
      t.references :site, foreign_key: true
      t.date :date_creation_utilisateur, null: false
      t.date :date_modification_utilisateur, null: false

      t.timestamps
    end

    add_index :utilisateurs, :email, unique: true
    add_index :utilisateurs, :confirmation_token, unique: true

    create_table :voitures do |t|
      t.string :marque, null: false
      t.string :modele, null: false
      t.integer :année_fabrication, null: false
      t.string :immatriculation, null: false
      t.string :carburant, null: false
      t.string :couleur, null: false
      t.integer :puissance, null: false
      t.integer :nombre_portes, null: false
      t.integer :nombre_places, null: false
      t.string :type_boite, null: false
      t.string :statut_voiture, null: false, default: 'DISPONIBLE'
      t.string :lien_image_voiture
      t.references :entreprise, null: false, foreign_key: true
      t.references :site, null: false, foreign_key: true
      t.date :date_creation_voiture, null: false
      t.date :date_modification_voiture, null: false

      t.timestamps
    end

    add_index :voitures, :immatriculation, unique: true

    create_table :cles do |t|
      t.string :statut_cle, null: false
      t.references :voiture, null: false, foreign_key: true
      t.references :utilisateur, foreign_key: true
      t.references :site, null: false, foreign_key: true
      t.date :date_creation_cle, null: false
      t.date :date_modification_cle, null: false

      t.timestamps
    end

    create_table :liste_passagers do |t|
      t.references :utilisateur, null: false, foreign_key: true
      t.date :date_creation_liste, null: false
      t.date :date_modification_liste, null: false

      t.timestamps
    end

    create_table :localisations do |t|
      t.string :nom_localisation, null: false
      t.string :adresse, null: false
      t.string :code_postal, null: false
      t.string :ville, null: false
      t.string :pays, null: false
      t.string :telephone
      t.string :email
      t.string :site_web
      t.boolean :added_by_sql
      t.date :date_creation_localisation, null: false
      t.date :date_modification_localisation, null: false

      t.timestamps
    end

    create_table :emprunts do |t|
      t.string :nom_emprunt, null: false
      t.datetime :date_debut, null: false
      t.datetime :date_fin, null: false
      t.references :voiture, null: false, foreign_key: true
      t.references :cle, foreign_key: true
      t.string :statut_emprunt, null: false
      t.references :utilisateur_demande, null: false, foreign_key: { to_table: :utilisateurs }
      t.string :description, null: false
      t.references :liste_passager, foreign_key: true
      t.references :localisation, foreign_key: true
      t.date :date_creation_emprunt, null: false
      t.date :date_modification_emprunt, null: false

      t.timestamps
    end

    # Ajout des contraintes de validation
    execute <<-SQL
      ALTER TABLE entreprises 
        ADD CONSTRAINT check_forme_juridique 
        CHECK (forme_juridique IN ('SA', 'SARL', 'SAS', 'EURL', 'EI', 'SC', 'SCS', 'SNC'));

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_numero_siret 
        CHECK (LENGTH(numero_siret) IN (9, 14));

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_adresse 
        CHECK (LENGTH(adresse) >= 10);

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_code_postal 
        CHECK (LENGTH(code_postal) = 5);

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_ville 
        CHECK (LENGTH(ville) >= 3);

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_pays 
        CHECK (LENGTH(pays) >= 5);

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_email 
        CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_site_web 
        CHECK (site_web ~ '^(https?://)?(www.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(/[^ ]*)?$');

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_effectif 
        CHECK (effectif > 0);

      ALTER TABLE entreprises 
        ADD CONSTRAINT check_capital_social 
        CHECK (capital_social > 0);
    SQL
  end

  def down
    drop_table :emprunts
    drop_table :localisations
    drop_table :liste_passagers
    drop_table :cles
    drop_table :voitures
    drop_table :utilisateurs
    drop_table :sites
    drop_table :entreprises
  end
end 
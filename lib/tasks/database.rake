namespace :db do
  desc 'Réinitialise la structure de la base de données'
  task :reset_structure => :environment do
    config = Rails.configuration.database_configuration[Rails.env]
    database_name = config['database']
    
    puts "🗑️  Suppression de la base de données..."
    Rake::Task['db:drop'].invoke
    
    puts "🎲 Création de la base de données..."
    Rake::Task['db:create'].invoke
    
    puts "📝 Création de la structure..."
    system("psql -d #{database_name} -f db/structure.sql")
    
    puts "✨ Structure de la base de données créée avec succès!"
  end

  desc 'Charge les données de test'
  task :load_seeds => :environment do
    config = Rails.configuration.database_configuration[Rails.env]
    database_name = config['database']
    
    puts "🌱 Chargement des données de test..."
    system("psql -d #{database_name} -f db/seeds.sql")
    
    puts "✨ Données de test chargées avec succès!"
  end

  desc 'Réinitialise la base de données et charge les données de test'
  task :reset_all => :environment do
    puts "🔄 Réinitialisation complète de la base de données..."
    
    Rake::Task['db:reset_structure'].invoke
    Rake::Task['db:load_seeds'].invoke
    
    puts "✨ Base de données réinitialisée avec succès!"
  end
end 
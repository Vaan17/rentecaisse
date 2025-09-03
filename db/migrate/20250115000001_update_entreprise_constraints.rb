class UpdateEntrepriseConstraints < ActiveRecord::Migration[7.1]
  def up
    # Supprimer les anciennes contraintes
    execute "ALTER TABLE entreprises DROP CONSTRAINT IF EXISTS check_site_web;"
    execute "ALTER TABLE entreprises DROP CONSTRAINT IF EXISTS check_email;"
    
    # Ajouter les nouvelles contraintes plus permissives
    execute <<-SQL
      ALTER TABLE entreprises 
      ADD CONSTRAINT check_site_web 
      CHECK (site_web ~ '^(https?://)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(/.*)?$');
    SQL

    execute <<-SQL
      ALTER TABLE entreprises 
      ADD CONSTRAINT check_email 
      CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    SQL
  end

  def down
    # Supprimer les nouvelles contraintes
    execute "ALTER TABLE entreprises DROP CONSTRAINT IF EXISTS check_site_web;"
    execute "ALTER TABLE entreprises DROP CONSTRAINT IF EXISTS check_email;"
    
    # Restaurer les anciennes contraintes (plus restrictives)
    execute <<-SQL
      ALTER TABLE entreprises 
      ADD CONSTRAINT check_email 
      CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');
    SQL

    execute <<-SQL
      ALTER TABLE entreprises 
      ADD CONSTRAINT check_site_web 
      CHECK (site_web ~ '^(https?://)?(www.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(/[^ ]*)?$');
    SQL
  end
end

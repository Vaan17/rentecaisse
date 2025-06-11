class CleanupOrphanedListePassagers < ActiveRecord::Migration[7.0]
  def up
    # Nettoyer les listes de passagers orphelines (sans emprunts associés)
    orphaned_lists = execute(<<-SQL
      SELECT lp.id 
      FROM liste_passagers lp 
      LEFT JOIN emprunts e ON e.liste_passager_id = lp.id 
      WHERE e.id IS NULL;
    SQL
    )
    
    if orphaned_lists.any?
      orphaned_ids = orphaned_lists.map { |row| row['id'] }
      puts "Suppression de #{orphaned_ids.count} listes de passagers orphelines: #{orphaned_ids}"
      
      # Supprimer d'abord les relations liste_passager_utilisateurs
      execute(<<-SQL
        DELETE FROM liste_passager_utilisateurs 
        WHERE liste_passager_id IN (#{orphaned_ids.join(',')});
      SQL
      )
      
      # Puis supprimer les listes
      execute(<<-SQL
        DELETE FROM liste_passagers 
        WHERE id IN (#{orphaned_ids.join(',')});
      SQL
      )
    else
      puts "Aucune liste de passagers orpheline trouvée"
    end
    
    # Nettoyer les relations liste_passager_utilisateurs orphelines
    orphaned_relations = execute(<<-SQL
      SELECT lpu.id 
      FROM liste_passager_utilisateurs lpu 
      LEFT JOIN liste_passagers lp ON lp.id = lpu.liste_passager_id 
      WHERE lp.id IS NULL;
    SQL
    )
    
    if orphaned_relations.any?
      orphaned_relation_ids = orphaned_relations.map { |row| row['id'] }
      puts "Suppression de #{orphaned_relation_ids.count} relations liste_passager_utilisateurs orphelines"
      
      execute(<<-SQL
        DELETE FROM liste_passager_utilisateurs 
        WHERE id IN (#{orphaned_relation_ids.join(',')});
      SQL
      )
    else
      puts "Aucune relation liste_passager_utilisateurs orpheline trouvée"
    end
  end
  
  def down
    # Pas de rollback possible pour cette migration de nettoyage
    puts "Impossible de restaurer les données supprimées lors du nettoyage"
  end
end 
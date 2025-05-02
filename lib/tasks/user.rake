namespace :users do
  desc "Anonymise les comptes utilisateurs dont la demande de suppression date de plus de 30 jours"
  task anonymize_deleted_accounts: :environment do
    require Rails.root.join('app/scheduler/DeletionAccountSchedule')
    
    puts "Début du processus d'anonymisation des comptes..."
    count = DeletionAccountSchedule.process_pending_anonymizations
    puts "Processus terminé: #{count} compte(s) anonymisé(s)."
  end
  
  desc "Anonymise un compte utilisateur spécifique par ID"
  task :anonymize_account, [:user_id] => :environment do |t, args|
    require Rails.root.join('app/scheduler/DeletionAccountSchedule')
    
    user_id = args[:user_id]
    if user_id.blank?
      puts "Erreur: Veuillez spécifier l'ID de l'utilisateur."
      puts "Usage: rake users:anonymize_account[123]"
      next
    end
    
    utilisateur = Utilisateur.find_by(id: user_id)
    if utilisateur.nil?
      puts "Erreur: Utilisateur avec l'ID #{user_id} non trouvé."
      next
    end
    
    if DeletionAccountSchedule.anonymize_user(utilisateur)
      puts "L'utilisateur ##{user_id} a été anonymisé avec succès."
    else
      puts "Erreur lors de l'anonymisation de l'utilisateur ##{user_id}."
    end
  end
end 
class DeletionAccountSchedule
  def self.anonymize_user(utilisateur)
    ActiveRecord::Base.transaction do
      user_id = utilisateur.id
      original_email = utilisateur.email

      utilisateur.update(
        email: "DeletedEmailUser#{user_id}@deleted.rentecaisse.com",
        password: "DeletedPasswordUser#{user_id}",
        nom: "DeletedNomUser#{user_id}",
        prenom: "DeletedPrenomUser#{user_id}",
        date_naissance: nil,
        genre: nil,
        adresse: "DeletedAdresseUser#{user_id}",
        code_postal: nil,
        ville: "DeletedVilleUser#{user_id}",
        pays: "DeletedPaysUser#{user_id}",
        telephone: "DeletedTelephoneUser#{user_id}",
        categorie_permis: "DeletedPermisUser#{user_id}",
        lien_image_utilisateur: nil,
        
        admin_entreprise: false,
        admin_rentecaisse: false,
        email_confirme: false,
        confirmation_token: nil,
        premiere_connexion: false,

        token_created_at: nil,
        reset_password_token: nil,
        reset_password_token_expires_at: nil,
        reset_password_sent_at: nil,
        session_token: nil,
        session_token_expires_at: nil,
        
        desactive: true,
        confirmation_entreprise: false,
        
        date_modification_utilisateur: Time.current
      )

      delete_user_files(user_id)

      begin
        Rails.logger.info "Envoi d'email de confirmation de suppression à #{original_email}"
        UserMailer.account_deletion_confirmation(original_email).deliver_now
      rescue => e
        Rails.logger.error "Erreur lors de l'envoi de l'email de confirmation: #{e.message}"
      end

      
      Rails.logger.info "Utilisateur ##{user_id} anonymisé avec succès"

      return true
    rescue => e
      Rails.logger.error "Erreur lors de l'anonymisation de l'utilisateur ##{user_id}: #{e.message}"
      return false
    end
  end
  
  def self.delete_user_files(user_id)
    begin
      user_directory = Rails.root.join('storage', 'users', "user_#{user_id}")
      
      if Dir.exist?(user_directory)
        FileUtils.rm_rf(user_directory)
        Rails.logger.info "Répertoire de fichiers pour l'utilisateur ##{user_id} supprimé avec succès"
      end
    rescue => e
      Rails.logger.error "Erreur lors de la suppression des fichiers de l'utilisateur ##{user_id}: #{e.message}"
    end
  end
  
  def self.process_pending_anonymizations
    date_limite = 30.days.ago
    
    # Exclure les utilisateurs déjà anonymisés (dont l'email contient deleted.rentecaisse.com)
    utilisateurs_a_anonymiser = Utilisateur.where("date_demande_suppression IS NOT NULL AND date_demande_suppression <= ?", date_limite)
                                         .where(desactive: true)
                                         .where("email NOT LIKE ?", "%deleted.rentecaisse.com%")
    
    count = 0
    utilisateurs_a_anonymiser.each do |utilisateur|
      if anonymize_user(utilisateur)
        count += 1
      end
    end
    
    Rails.logger.info "Anonymisation terminée: #{count} utilisateur(s) anonymisé(s)"
    return count
  end
end 
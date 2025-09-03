class VoitureService
  # Taille maximale de 5MB
  MAX_IMAGE_SIZE = 5.megabytes
  ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']
  ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']
  
  # Récupère les voitures du site et de l'entreprise de l'utilisateur
  def self.voitures_par_site_et_entreprise(site_id, entreprise_id)
    Voiture.where(site_id: site_id, entreprise_id: entreprise_id)
  end
  
  # Vérifie si une voiture est disponible pour un intervalle de temps donné
  def self.voiture_disponible?(voiture_id, date_debut, date_fin)
    # Recherche d'emprunts qui se chevauchent avec l'intervalle demandé
    emprunts_chevauchants = Emprunt.where(voiture_id: voiture_id)
                                  .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                                  date_fin, date_debut, date_fin, date_debut, date_debut, date_fin)
                                  
    # Retourne true s'il n'y a pas d'emprunts chevauchants
    emprunts_chevauchants.empty?
  end
  
  # Récupère les clés disponibles pour une voiture
  def self.cles_disponibles_pour_voiture(voiture_id)
    Cle.where(voiture_id: voiture_id)
  end
  
  # Récupère l'image d'une voiture
  def self.get_voiture_image(voiture_id)
    voiture_folder = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture_id}")
    
    # Vérifier si le dossier existe
    return nil unless Dir.exist?(voiture_folder)
    
    # Chercher la première image dans le dossier
    photo_path = Dir.glob("#{voiture_folder}/*").first
    
    # Vérifier si une image a été trouvée
    return nil unless photo_path && File.exist?(photo_path)
    
    # Lire et encoder l'image
    content = File.read(photo_path)
    content_type = case File.extname(photo_path).downcase
                  when '.jpg', '.jpeg'
                    'image/jpeg'
                  when '.png'
                    'image/png'
                  else
                    'application/octet-stream'
                  end
                  
    return {
      image_data: Base64.encode64(content),
      content_type: content_type
    }
  end
  
  # Validation de l'image uploadée
  def self.validate_image(file)
    Rails.logger.info "Validation de l'image: #{file.original_filename} (#{file.size} bytes, #{file.content_type})"

    # Vérification de la taille
    if file.size > MAX_IMAGE_SIZE
      Rails.logger.warn "Image trop volumineuse: #{file.size} bytes"
      return { success: false, message: "L'image ne doit pas dépasser 5MB" }
    end

    # Vérification du type MIME
    unless ALLOWED_MIME_TYPES.include?(file.content_type)
      Rails.logger.warn "Type MIME non autorisé: #{file.content_type}"
      return { success: false, message: "Format non supporté. Utilisez JPG, JPEG, PNG ou GIF" }
    end

    # Vérification de l'extension
    extension = File.extname(file.original_filename).downcase[1..-1]
    unless ALLOWED_EXTENSIONS.include?(extension)
      Rails.logger.warn "Extension non autorisée: #{extension}"
      return { success: false, message: "Extension de fichier non autorisée" }
    end

    # Vérification de cohérence entre le type MIME et l'extension
    mime_extension_map = {
      'image/jpeg' => ['jpg', 'jpeg'],
      'image/png' => ['png'],
      'image/gif' => ['gif']
    }

    unless mime_extension_map[file.content_type]&.include?(extension)
      Rails.logger.warn "Incohérence type MIME/extension: #{file.content_type} vs #{extension}"
      return { success: false, message: "Le type de fichier ne correspond pas à l'extension" }
    end

    Rails.logger.info "Validation de l'image réussie"
    { success: true }
  end
  
  # Met à jour la photo d'une voiture
  def self.update_voiture_photo(voiture, photo)
    # Validation de l'image
    validation_result = validate_image(photo)
    return validation_result unless validation_result[:success]

    begin
      # Créer le dossier pour la voiture s'il n'existe pas
      voiture_folder = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture.id}")
      FileUtils.mkdir_p(voiture_folder)

      # Supprimer l'ancienne photo si elle existe
      old_photo = Dir.glob("#{voiture_folder}/*").first
      File.delete(old_photo) if old_photo && File.exist?(old_photo)

      # Générer un nom unique pour la nouvelle photo
      extension = File.extname(photo.original_filename)
      filename = "profile_#{Time.now.to_i}#{extension}"
      filepath = voiture_folder.join(filename)

      # Sauvegarder la nouvelle photo
      File.binwrite(filepath, photo.read)

      # Mettre à jour le champ lien_image_voiture
      if voiture.update(lien_image_voiture: filename)
        { success: true, message: "Photo mise à jour avec succès" }
      else
        # Si la mise à jour échoue, supprimer le fichier
        File.delete(filepath) if File.exist?(filepath)
        { success: false, message: "Erreur lors de la mise à jour de la base de données" }
      end
    rescue Errno::ENOENT => e
      Rails.logger.error "Erreur de fichier: #{e.message}"
      { success: false, message: "Erreur lors de la création du dossier" }
    rescue Errno::EACCES => e
      Rails.logger.error "Erreur de permissions: #{e.message}"
      { success: false, message: "Erreur de permissions sur le dossier de stockage" }
    rescue StandardError => e
      Rails.logger.error "Erreur lors de l'upload: #{e.message}"
      { success: false, message: "Erreur lors de l'upload de l'image" }
    end
  end

  # Suppression de l'image de la voiture
  def self.delete_voiture_photo(voiture)
    Rails.logger.info "Début de la suppression de photo pour la voiture #{voiture.id}"

    begin
      # Vérifier si la voiture a bien une image
      unless voiture.lien_image_voiture.present?
        return { success: false, message: "Aucune image à supprimer" }
      end

      # Chemin vers le fichier image
      image_path = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture.id}", voiture.lien_image_voiture)
      
      # Supprimer le fichier physique s'il existe
      if File.exist?(image_path)
        File.delete(image_path)
        Rails.logger.info "Fichier image supprimé: #{image_path}"
      else
        Rails.logger.warn "Fichier image non trouvé: #{image_path}"
      end

      # Mettre à jour la base de données pour supprimer le lien
      voiture.update!(lien_image_voiture: nil)
      Rails.logger.info "Lien image supprimé de la base de données pour la voiture #{voiture.id}"

      # Vérifier si le dossier est vide et le supprimer si c'est le cas
      storage_path = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture.id}")
      if Dir.exist?(storage_path) && Dir.empty?(storage_path)
        Dir.delete(storage_path)
        Rails.logger.info "Dossier vide supprimé: #{storage_path}"
      end

      { success: true, message: "Image supprimée avec succès" }

    rescue StandardError => e
      Rails.logger.error "Erreur lors de la suppression de l'image: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      { success: false, message: "Erreur lors de la suppression de l'image" }
    end
  end
end 
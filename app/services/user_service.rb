class UserService
  # Taille maximale de 5MB
  MAX_IMAGE_SIZE = 5.megabytes
  ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']
  ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']
  
  def self.update_profile(user, profile_params)
    user.update!(
      prenom: profile_params[:prenom],
      nom: profile_params[:nom],
      adresse: profile_params[:adresse],
      ville: profile_params[:ville],
      code_postal: profile_params[:code_postal],
      pays: profile_params[:pays],
      telephone: profile_params[:telephone],
      genre: profile_params[:genre],
      date_naissance: profile_params[:date_naissance],
      categorie_permis: profile_params[:categorie_permis],
      premiere_connexion: false
    )
    
    { success: true }
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors.full_messages }
  rescue StandardError => e
    { success: false, errors: [e.message] }
  end

  def self.cancel_affectation(user)
    begin
      user.update!(
        entreprise_id: nil,
        site_id: nil,
        confirmation_entreprise: false
      )
      { success: true }
    rescue ActiveRecord::RecordInvalid => e
      { success: false, errors: e.record.errors.full_messages }
    rescue StandardError => e
      { success: false, errors: [e.message] }
    end
  end

  def self.update_user_profile(user, params)
    user.update(params)
  end

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

  def self.update_user_photo(user, photo)
    # Validation de l'image
    validation_result = validate_image(photo)
    return validation_result unless validation_result[:success]

    # Créer le dossier pour l'utilisateur s'il n'existe pas
    user_folder = Rails.root.join('storage', 'users', "user_#{user.id}", 'profile')
    FileUtils.mkdir_p(user_folder)

    # Supprimer l'ancienne photo si elle existe
    old_photo = Dir.glob("#{user_folder}/*").first
    File.delete(old_photo) if old_photo

    # Générer un nom unique pour la nouvelle photo
    extension = File.extname(photo.original_filename)
    filename = "profile_#{Time.now.to_i}#{extension}"
    filepath = user_folder.join(filename)

    # Sauvegarder la nouvelle photo
    File.binwrite(filepath, photo.read)

    # Mettre à jour le champ lien_image_utilisateur
    if user.update(lien_image_utilisateur: filename)
      { success: true, message: "Photo mise à jour avec succès" }
    else
      { success: false, message: "Erreur lors de la mise à jour de la photo" }
    end
  end

  def self.get_user_profile_image(user)
    user_folder = Rails.root.join('storage', 'users', "user_#{user.id}", 'profile')
    photo_path = Dir.glob("#{user_folder}/*").first
    
    if photo_path
      "http://localhost:3000/api/users/profile-image?user_id=#{user.id}&t=#{File.mtime(photo_path).to_i}"
    else
      nil
    end
  end
end
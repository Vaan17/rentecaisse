class SiteService
  # Taille maximale de 5MB
  MAX_IMAGE_SIZE = 5.megabytes
  ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']
  ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

  def self.get_sites_by_enterprise(enterprise_id)
    Site.where(entreprise_id: enterprise_id).map do |site|
      {
        id: site.id,
        nom: site.nom_site,
        adresse: site.adresse
      }
    end
  end

  def self.get_site_details(site_id)
    site = Site.find_by(id: site_id)
    return nil unless site

    {
      nom: site.nom_site,
      adresse: site.adresse,
      ville: site.ville,
      code_postal: site.code_postal,
      pays: site.pays
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
    extension = File.extname(file.original_filename).downcase.gsub('.', '')
    unless ALLOWED_EXTENSIONS.include?(extension)
      Rails.logger.warn "Extension non autorisée: #{extension}"
      return { success: false, message: "L'extension du fichier n'est pas valide" }
    end

    # Vérification de cohérence entre type MIME et extension
    case file.content_type
    when 'image/jpeg'
      unless ['jpg', 'jpeg'].include?(extension)
        return { success: false, message: "L'extension ne correspond pas au type de fichier" }
      end
    when 'image/png'
      unless extension == 'png'
        return { success: false, message: "L'extension ne correspond pas au type de fichier" }
      end
    when 'image/gif'
      unless extension == 'gif'
        return { success: false, message: "L'extension ne correspond pas au type de fichier" }
      end
    end

    { success: true, message: "Image valide" }
  end

  # Upload et sauvegarde de l'image du site
  def self.update_site_photo(site, file)
    Rails.logger.info "Début de l'upload de photo pour le site #{site.id}"

    # Validation de l'image
    validation_result = validate_image(file)
    return validation_result unless validation_result[:success]

    begin
      # Création du dossier de stockage
      storage_path = Rails.root.join('storage', 'sites', "site_#{site.id}")
      FileUtils.mkdir_p(storage_path) unless Dir.exist?(storage_path)

      # Suppression de l'ancienne image si elle existe
      if site.lien_image_site.present?
        old_image_path = Rails.root.join('storage', 'sites', "site_#{site.id}", site.lien_image_site)
        if File.exist?(old_image_path)
          File.delete(old_image_path)
          Rails.logger.info "Ancienne image supprimée: #{old_image_path}"
        end
      end

      # Génération d'un nom unique pour l'image
      timestamp = Time.current.to_i
      extension = File.extname(file.original_filename)
      filename = "profile_#{timestamp}#{extension}"
      file_path = storage_path.join(filename)

      # Sauvegarde du fichier
      File.open(file_path, 'wb') do |f|
        f.write(file.read)
      end

      # Mise à jour de la base de données
      site.update!(lien_image_site: filename)

      Rails.logger.info "Image sauvegardée avec succès: #{file_path}"
      { success: true, message: "Image uploadée avec succès" }

    rescue StandardError => e
      Rails.logger.error "Erreur lors de l'upload de l'image: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      { success: false, message: "Erreur lors de la sauvegarde de l'image" }
    end
  end

  # Récupération de l'image du site en base64
  def self.get_site_image(site)
    return "/images/placeholders/site-placeholder.svg" if site.lien_image_site.blank?

    image_path = Rails.root.join('storage', 'sites', "site_#{site.id}", site.lien_image_site)
    
    if File.exist?(image_path)
      begin
        image_data = File.read(image_path)
        extension = File.extname(site.lien_image_site).downcase.gsub('.', '')
        
        # Détermination du type MIME
        mime_type = case extension
                   when 'jpg', 'jpeg'
                     'image/jpeg'
                   when 'png'
                     'image/png'
                   when 'gif'
                     'image/gif'
                   else
                     'image/jpeg'
                   end

        base64_image = Base64.strict_encode64(image_data)
        "data:#{mime_type};base64,#{base64_image}"
      rescue StandardError => e
        Rails.logger.error "Erreur lors de la lecture de l'image du site #{site.id}: #{e.message}"
        "/images/placeholders/site-placeholder.svg"
      end
    else
      Rails.logger.warn "Image non trouvée pour le site #{site.id}: #{image_path}"
      "/images/placeholders/site-placeholder.svg"
    end
  end
end 
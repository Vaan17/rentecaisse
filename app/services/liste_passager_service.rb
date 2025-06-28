class ListePassagerService
  # Crée une liste de passagers avec les passagers fournis
  def self.create_with_passagers(passager_ids)
    return nil if passager_ids.blank?
    
    ActiveRecord::Base.transaction do
      # Créer sans validation d'abord
      liste = ListePassager.new
      liste.save!(validate: false)
      
      # Ajouter les passagers
      passager_ids.each do |passager_id|
        liste.liste_passager_utilisateurs.create!(utilisateur_id: passager_id)
      end
      
      # Maintenant valider avec les passagers en place
      liste.reload
      liste.save! if liste.changed?
      
      liste
    end
  end
  
  # Ajoute un passager à une liste existante
  def self.ajouter_passager(liste_passager, utilisateur_id)
    liste_passager.liste_passager_utilisateurs.find_or_create_by(utilisateur_id: utilisateur_id)
  end
  
  # Récupère les IDs des passagers d'une liste
  def self.passager_ids(liste_passager)
    liste_passager.utilisateurs.pluck(:id)
  end
  
  # Récupère les noms complets des passagers d'une liste
  def self.noms_passagers(liste_passager)
    liste_passager.utilisateurs.pluck(:prenom, :nom).map { |prenom, nom| "#{prenom} #{nom}" }
  end
  
  # Supprime une liste de passagers et ses associations
  def self.supprimer_liste_passagers(liste_passager_id)
    ListePassagerUtilisateur.where(liste_passager_id: liste_passager_id).destroy_all
    ListePassager.find(liste_passager_id).destroy
  end
end

class ClesController < ApplicationController
  # Récupérer toutes les clés
  def fetch_all
    cles = Cle.all
    render json: cles
  end
  
  # Récupérer les clés pour une voiture spécifique
  def fetch_by_voiture
    voiture_id = params[:voiture_id]
    
    if voiture_id.blank?
      return render json: { error: "L'ID de la voiture est requis" }, status: :bad_request
    end
    
    cles = Cle.where(voiture_id: voiture_id)
    
    render json: cles
  end
  
  # Récupérer les clés disponibles pour une voiture (non associées à un emprunt en cours)
  def fetch_disponibles_by_voiture
    voiture_id = params[:voiture_id]
    date_debut = params[:date_debut]
    date_fin = params[:date_fin]
    
    if voiture_id.blank?
      return render json: { error: "L'ID de la voiture est requis" }, status: :bad_request
    end
    
    # Récupérer toutes les clés de la voiture
    cles = Cle.where(voiture_id: voiture_id)
    
    # Si des dates sont spécifiées, exclure les clés utilisées dans des emprunts à ces dates
    if date_debut.present? && date_fin.present?
      begin
        date_debut = DateTime.parse(date_debut)
        date_fin = DateTime.parse(date_fin)
      rescue ArgumentError
        return render json: { error: "Format de date invalide" }, status: :bad_request
      end
      
      # Récupérer les IDs des clés déjà utilisées dans des emprunts pour cette période
      cles_utilisees_ids = Emprunt.where(cle_id: cles.pluck(:id))
                                .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                                      date_fin, date_debut, date_debut, date_fin)
                                .pluck(:cle_id)
      
      # Exclure ces clés
      cles = cles.where.not(id: cles_utilisees_ids)
    end
    
    render json: cles
  end
end 